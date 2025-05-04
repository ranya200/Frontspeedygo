import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, QueryList } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatControllerService, User, UserControllerService } from 'src/app/openapi';
import { Chat } from 'src/app/models/chat.model'; // Import our custom Chat interface
import { ChatSocketService } from 'src/app/services/chat/chat-socket.service';
import { ChatFileUploadService } from 'src/app/services/chat/chat-file-upload.service';
import { ChatNotificationService } from 'src/app/services/chat/chat-notification.service';
import { jwtDecode } from 'jwt-decode';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/FrontOffice/shared/confirm-dialog/confirm-dialog.component';
import { MapPreviewComponent } from '../map-preview/map-preview.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {
  message = '';
  messages: Chat[] = [];
  currentUserId!: string;
  receiverId!: string;
  currentUser: string = 'You';
  selectedReceiver: string = '';
  users: User[] = [];
  filteredUsers: User[] = []; // For search functionality
  searchTerm: string = ''; // For search functionality
  lastMessageTimestamps: { [userId: string]: string } = {}; // For sorting users by last conversation
  selectedFile?: File;
  messageToDelete?: Chat;
  confirmDeleteMessage = false;
  isRecording = false;
  recordedAudioBlob?: Blob;
  mediaRecorder?: MediaRecorder;
  audioChunks: Blob[] = [];
  onlineStatus: { [userId: string]: boolean } = {};  // This will hold the online status of users
  unreadMessages: { [userId: string]: number } = {}; // Track unread messages per user

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('waveCanvas', { static: false }) waveCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('audioElement') audioElements!: QueryList<ElementRef<HTMLAudioElement>>;

  private audioContext?: AudioContext;
  private analyser?: AnalyserNode;
  private dataArray?: Uint8Array;
  private animationId?: number;

  constructor(
    private chatSocketService: ChatSocketService,
    private chatSocketService1: ChatControllerService,
    private userApiService: UserControllerService,
    private chatFileUploadService: ChatFileUploadService,
    private dialog: MatDialog,
    private chatNotificationService: ChatNotificationService
  ) {}

  ngOnInit(): void {
    // Clear any previously active conversation
    localStorage.removeItem('activeConversation');

    // Check for sender parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const notificationSenderId = urlParams.get('sender');

    if (notificationSenderId) {
      console.log(`Notification sender detected in URL: ${notificationSenderId}`);
      // We'll store this to select the user after loading
      localStorage.setItem('pendingSelectSender', notificationSenderId);
    }

    // Subscribe to new messages
    this.chatSocketService.message$.subscribe((msg) => {
      if (msg) {
        // Only add the message if it's part of the current conversation
        const isRelevantToCurrentConversation =
          // Message is between current user and selected receiver
          (msg.sender === this.currentUserId && msg.receiver === this.receiverId) ||
          (msg.sender === this.receiverId && msg.receiver === this.currentUserId);

        // Only mark as seen if:
        // 1. Message is for the current user
        // 2. Message is from the currently selected conversation partner
        // 3. The user is actively viewing this conversation
        if (msg.receiver === this.currentUserId &&
            this.isConversationActive(msg.sender)) {
          this.markMessageAsSeen(msg);
        }

        // Only add to messages array if it's part of the current conversation
        if (isRelevantToCurrentConversation) {
          this.messages.push(msg);
          console.log('Added message to current conversation:', msg);

          // Scroll to bottom when receiving a new message in the current conversation
          setTimeout(() => this.scrollToBottom(), 100);
        } else {
          console.log('Message not relevant to current conversation, not displaying:', msg);

          // If the message is for the current user, increment unread count for that sender
          if (msg.receiver === this.currentUserId && msg.sender) {
            // Initialize if not exists
            if (!this.unreadMessages[msg.sender]) {
              this.unreadMessages[msg.sender] = 0;
            }
            // Increment unread count
            this.unreadMessages[msg.sender]++;
            console.log(`Unread messages from ${msg.sender}: ${this.unreadMessages[msg.sender]}`);
          }
        }
      }
    });

    // Subscribe to message status updates
    this.chatSocketService.messageStatus$.subscribe((statusUpdate) => {
      if (statusUpdate) {
        console.log('Received message status update:', statusUpdate);

        // If this is a single message update
        if (statusUpdate.id) {
          // Find the message in our list and update its seen status
          const messageIndex = this.messages.findIndex(m => m.id === statusUpdate.id);
          if (messageIndex !== -1) {
            this.messages[messageIndex].seen = statusUpdate.seen;
            this.messages[messageIndex].seenAt = statusUpdate.seenAt;
          }
        }
        // If this is a batch update
        else if (statusUpdate.sender && statusUpdate.receiver) {
          // Update all messages from sender to receiver
          this.messages.forEach(msg => {
            if (msg.sender === statusUpdate.sender && msg.receiver === statusUpdate.receiver) {
              msg.seen = true;
              msg.seenAt = statusUpdate.timestamp;
            }
          });
        }
      }
    });

    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.currentUserId = decoded.sub;
      this.currentUser = decoded.preferred_username || 'You';
    }

    this.getAllOtherUsers();
  }

  // Check if a conversation with a specific user is active
  isConversationActive(userId: string | undefined): boolean {
    if (!userId) return false;
    // A conversation is active if it's the currently selected receiver
    // We're being more permissive here to ensure messages get marked as seen
    // when the user enters a conversation
    return this.selectedReceiver === userId;
  }

  // Mark a message as seen
  markMessageAsSeen(message: Chat): void {
    if (message.id && message.sender) {
      // Check if this is being called during conversation activation
      const isActivatingConversation = this.selectedReceiver === message.sender;

      // Either the conversation is already active OR we're in the process of activating it
      if (isActivatingConversation || this.isConversationActive(message.sender)) {
        console.log(`Marking message ${message.id} as seen - viewing conversation with ${message.sender}`);

        // Use WebSocket to mark the message as seen (real-time)
        this.chatSocketService.markMessageAsSeen(message.id);

        // Also update the local message object for immediate UI feedback
        message.seen = true;
        message.seenAt = new Date().toISOString();
      } else {
        console.log(`Not marking message ${message.id} as seen - not viewing conversation with ${message.sender}`);
      }
    }
  }

  // Search functionality
  searchUsers(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = searchTerm;

    if (!searchTerm) {
      this.filteredUsers = [...this.users]; // Reset to all users when search is empty
      this.sortUsersByLastMessage(); // Keep the sorting
      return;
    }

    // Filter users based on search term
    this.filteredUsers = this.users.filter(user =>
      user.firstName?.toLowerCase().includes(searchTerm) ||
      user.lastName?.toLowerCase().includes(searchTerm) ||
      user.username?.toLowerCase().includes(searchTerm)
    );
  }

  // Sort users by last message timestamp
  sortUsersByLastMessage(): void {
    this.filteredUsers.sort((a, b) => {
      const timestampA = this.lastMessageTimestamps[a.id!] || '0';
      const timestampB = this.lastMessageTimestamps[b.id!] || '0';
      return timestampB.localeCompare(timestampA); // Most recent first
    });
  }

  // Get the timestamp of the last message between two users
  getLastMessageTimestamp(userId1: string, userId2: string): void {
    this.chatSocketService1.getMessagesBetween(userId1, userId2).subscribe({
      next: (messages: Chat[]) => {
        if (messages && messages.length > 0) {
          // Sort messages by timestamp (newest first)
          const sortedMessages = [...messages].sort((a, b) => {
            return (b.timestamp || '').localeCompare(a.timestamp || '');
          });

          // Get the timestamp of the most recent message
          const lastMessage = sortedMessages[0];
          if (lastMessage && lastMessage.timestamp) {
            this.lastMessageTimestamps[userId1] = lastMessage.timestamp;

            // Re-sort users after getting the timestamp
            this.sortUsersByLastMessage();
          }
        }
      },
      error: (err) => console.error(`Error getting messages for timestamp between ${userId1} and ${userId2}:`, err)
    });
  }

  getAllOtherUsers(): void {
    this.userApiService.getAllOtherUsers().subscribe({
      next: async (res) => {
        this.users = res instanceof Blob ? JSON.parse(await res.text()) : res;
        this.filteredUsers = [...this.users]; // Initialize filtered users with all users

        // ✅ Vérifier le statut en ligne pour chaque utilisateur
        this.users.forEach(user => {
          this.getOnlineStatus(user.id!);

          // Get last message timestamp for each user
          if (user.id && this.currentUserId) {
            this.getLastMessageTimestamp(user.id, this.currentUserId);
          }
        });

        // Initialize unread message counts after users are loaded
        if (this.currentUserId) {
          this.initializeUnreadMessageCounts();
        }

        // Check if we need to select a specific sender (from notification)
        const pendingSelectSender = localStorage.getItem('pendingSelectSender');
        if (pendingSelectSender) {
          console.log(`Selecting sender from notification: ${pendingSelectSender}`);

          // Find the user with this ID
          const senderUser = this.users.find(user => user.id === pendingSelectSender);
          if (senderUser) {
            // Select this user
            setTimeout(() => {
              this.selectUser(senderUser);

              // Clear the pending selection
              localStorage.removeItem('pendingSelectSender');
            }, 100);
          } else {
            console.log(`Sender user not found: ${pendingSelectSender}`);
          }
        }
      },
      error: (err) => console.error('Erreur chargement utilisateurs', err)
    });
  }

  selectUser(user: User): void {
    this.receiverId = user.id!;
    this.selectedReceiver = user.id!;

    if (this.currentUserId && this.receiverId) {
      // Clear existing messages before loading new conversation
      this.messages = [];
      console.log('Cleared messages for new conversation');

      // Reset unread messages counter for this user
      this.unreadMessages[this.receiverId] = 0;

      // Also reset the unread count in the notification service
      this.chatNotificationService.resetUnreadCountForSender(this.receiverId);

      // Load messages between current user and selected receiver
      this.loadMessagesBetween(this.currentUserId, this.receiverId);

      // Explicitly mark this conversation as active
      this.markConversationAsActive();
    } else {
      console.warn('Utilisateur courant ou destinataire non défini.');
    }
  }

  // Mark the current conversation as active, which means the user is viewing it
  markConversationAsActive(): void {
    console.log(`Marking conversation with ${this.receiverId} as active`);

    // Store in localStorage to track which conversation the user is currently viewing
    localStorage.setItem('activeConversation', this.receiverId);

    // Immediately mark all unseen messages in this conversation as seen
    if (this.currentUserId && this.receiverId) {
      console.log(`Marking all unseen messages from ${this.receiverId} as seen immediately`);

      // Find all unseen messages from the selected user and mark them as seen
      const unseenMessages = this.messages.filter(msg =>
        msg.sender === this.receiverId &&
        msg.receiver === this.currentUserId &&
        !msg.seen
      );

      if (unseenMessages.length > 0) {
        console.log(`Found ${unseenMessages.length} unseen messages to mark as seen`);

        // Mark all messages as seen in one go via WebSocket for real-time updates
        this.markAllMessagesAsSeen(this.receiverId, this.currentUserId);

        // Also update local message objects immediately for instant UI feedback
        const now = new Date().toISOString();
        unseenMessages.forEach(msg => {
          msg.seen = true;
          msg.seenAt = now;
        });

        // Make sure the notification service is updated
        this.chatNotificationService.resetUnreadCountForSender(this.receiverId);
      } else {
        console.log('No unseen messages to mark');
      }
    }
  }

  loadMessagesBetween(senderId: string, receiverId: string): void {
    this.chatSocketService1.getMessagesBetween(senderId, receiverId).subscribe({
      next: async (res) => {
        let messages = res instanceof Blob ? JSON.parse(await res.text()) : res;

        // Sort messages by timestamp (oldest first)
        messages = messages.sort((a: Chat, b: Chat) => {
          return (a.timestamp || '').localeCompare(b.timestamp || '');
        });

        this.messages = messages;

        // Update the last message timestamp for sorting users
        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1]; // Most recent message
          if (lastMessage && lastMessage.timestamp) {
            this.lastMessageTimestamps[receiverId] = lastMessage.timestamp;
            // Re-sort users
            this.sortUsersByLastMessage();
          }
        }

        // We're loading messages for a conversation the user has selected,
        // so we should mark messages as seen immediately
        if (senderId === this.currentUserId) {
          console.log(`User has selected conversation with ${receiverId}, marking messages as seen immediately`);

          // Count unseen messages for logging
          const unseenCount = this.messages.filter(msg =>
            msg.sender === receiverId &&
            msg.receiver === senderId &&
            !msg.seen
          ).length;

          if (unseenCount > 0) {
            console.log(`Found ${unseenCount} unseen messages to mark as seen`);

            // Mark all messages from the other user as seen in one go
            this.markAllMessagesAsSeen(receiverId, senderId);
          } else {
            console.log('No unseen messages to mark');
          }
        }

        // Scroll to the bottom to show most recent messages
        setTimeout(() => {
          this.scrollToBottom();
        }, 100);
      },
      error: err => console.error('Erreur chargement messages entre users', err)
    });
  }

  // Scroll to the bottom of the messages container
  scrollToBottom(): void {
    try {
      const messagesContainer = document.querySelector('.messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  // Mark all messages from a sender to a receiver as seen
  markAllMessagesAsSeen(sender: string, receiver: string): void {
    // Check if this is being called from markConversationAsActive (which means we should force mark as seen)
    const isCalledFromActivation = this.selectedReceiver === sender &&
                                  localStorage.getItem('activeConversation') === sender;

    // Either the conversation is already active OR we're in the process of activating it
    if ((this.isConversationActive(sender) && this.currentUserId === receiver) || isCalledFromActivation) {
      console.log(`Marking all messages from ${sender} to ${receiver} as seen - actively viewing conversation`);

      // Use WebSocket to mark all messages as seen (real-time)
      this.chatSocketService.markAllMessagesAsSeen(sender, receiver);

      // Also update local message objects for immediate UI feedback
      const now = new Date().toISOString();
      this.messages.forEach(msg => {
        if (msg.sender === sender && msg.receiver === receiver && !msg.seen) {
          msg.seen = true;
          msg.seenAt = now;
        }
      });
    } else {
      console.log(`Not marking messages from ${sender} to ${receiver} as seen - not actively viewing conversation`);
    }
  }

  getMessagesBetween(): void {
    if (!this.currentUserId || !this.selectedReceiver) return;

    this.chatSocketService1.getMessagesBetween(this.currentUserId, this.selectedReceiver).subscribe({
      next: async (res) => {
        this.messages = res instanceof Blob ? JSON.parse(await res.text()) : res;
      },
      error: (err) => console.error('Erreur de récupération des anciens messages', err)
    });
  }

  isImage(content?: string): boolean {
    return !!content && /\.(jpeg|jpg|gif|png)$/i.test(content);
  }

  isAudio(url: string | undefined): boolean {
    return !!url && (url.endsWith('.webm') || url.endsWith('.mp3') || url.endsWith('.wav'));
  }

  isFile(content?: string): boolean {
    return !!content && /\.(pdf|docx?|xlsx?|pptx?)$/i.test(content);
  }

  isGoogleMap(content?: string): boolean {
    return !!content && content.includes('google.com/maps');
  }

  getFilenameFromUrl(url?: string): string {
    if (!url) return 'fichier inconnu';
    const parts = url.split('/');
    return parts.length > 0 ? parts[parts.length - 1] : 'fichier inconnu';
  }



  async requestMicrophoneAccess(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error("❌ Accès micro refusé :", error);
      return false;
    }
  }

  async startRecording(): Promise<void> {
    const granted = await this.requestMicrophoneAccess();
    if (!granted) return;

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = event => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        this.recordedAudioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        console.log("🎤 Enregistrement terminé");

        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.audioContext) this.audioContext.close();
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      console.log("🎙️ Enregistrement démarré...");

      this.audioContext = new AudioContext();
      const source = this.audioContext.createMediaStreamSource(stream);

      this.analyser = this.audioContext.createAnalyser();
      source.connect(this.analyser);

      this.analyser.fftSize = 128;
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      this.drawWaveform();
    }).catch(err => {
      console.error("❌ Erreur accès micro:", err);
      this.isRecording = false;
    });
  }

  drawWaveform() {
    if (!this.waveCanvas || !this.analyser || !this.dataArray) return;

    const canvas = this.waveCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      this.animationId = requestAnimationFrame(draw);
      this.analyser!.getByteFrequencyData(this.dataArray!);

      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#1976d2';
      ctx.beginPath();

      const barWidth = (width / this.dataArray!.length) * 2.5;
      let x = 0;

      for (let i = 0; i < this.dataArray!.length; i++) {
        const barHeight = this.dataArray![i] / 2;
        ctx.moveTo(x, height);
        ctx.lineTo(x, height - barHeight);
        x += barWidth + 1;
      }

      ctx.stroke();
    };

    draw();
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.isRecording = false;
      console.log("⏹️ Enregistrement stoppé");

      const tracks = (this.mediaRecorder.stream as MediaStream).getTracks();
      tracks.forEach(track => track.stop());

      if (this.animationId) cancelAnimationFrame(this.animationId);
      if (this.audioContext) this.audioContext.close();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  send(): void {
    if (this.recordedAudioBlob) {
      const formData = new FormData();
      formData.append('file', this.recordedAudioBlob, 'audio.webm');

      this.chatSocketService.uploadFileAndSendMessage(formData).subscribe({
        next: (fileUrl) => {
          const chatMessage: Chat = {
            sender: this.currentUserId,
            receiver: this.receiverId,
            content: fileUrl,
            timestamp: new Date().toISOString(),
            seen: false // Initialize as unseen
          };
          this.chatSocketService.sendMessage(chatMessage);
          this.recordedAudioBlob = undefined;

          // Scroll to bottom after sending
          setTimeout(() => this.scrollToBottom(), 100);
        },
        error: (err) => console.error("Erreur envoi audio :", err)
      });
      return;
    }

    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.chatSocketService.uploadFileAndSendMessage(formData).subscribe({
        next: (fileUrl) => {
          const chatMessage: Chat = {
            sender: this.currentUserId,
            receiver: this.receiverId,
            content: fileUrl,
            timestamp: new Date().toISOString(),
            seen: false // Initialize as unseen
          };
          this.chatSocketService.sendMessage(chatMessage);
          this.selectedFile = undefined;
          this.fileInputRef.nativeElement.value = '';
          this.message = '';

          // Scroll to bottom after sending
          setTimeout(() => this.scrollToBottom(), 100);
        },
        error: (err) => console.error("Erreur fichier :", err)
      });
    } else if (this.message.trim()) {
      const chatMessage: Chat = {
        sender: this.currentUserId,
        receiver: this.receiverId,
        content: this.message,
        timestamp: new Date().toISOString(),
        seen: false // Initialize as unseen
      };
      this.chatSocketService.sendMessage(chatMessage);
      this.message = '';

      // Scroll to bottom after sending
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  openLocationDialog(): void {
    const dialogRef = this.dialog.open(MapPreviewComponent, {
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      restoreFocus: false
    });

    dialogRef.afterClosed().subscribe((coords: { lat: number, lng: number }) => {
      if (coords) {
        const mapUrl = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
        const chatMessage: Chat = {
          sender: this.currentUserId,
          receiver: this.receiverId,
          content: mapUrl,
          timestamp: new Date().toISOString(),
          seen: false // Initialize as unseen
        };
        this.chatSocketService.sendMessage(chatMessage);

        // Scroll to bottom after sending
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }

  askDelete(message: Chat): void {
    this.messageToDelete = message;
    this.confirmDeleteMessage = true;
  }

  cancelDelete(): void {
    this.messageToDelete = undefined;
    this.confirmDeleteMessage = false;
  }

  deleteMessage(): void {
    if (this.messageToDelete?.id) {
      this.chatSocketService1.deleteMessage(this.messageToDelete.id).subscribe({
        next: () => {
          this.messages = this.messages.filter(msg => msg.id !== this.messageToDelete?.id);
          this.confirmDeleteMessage = false;
        },
        error: err => console.error('Erreur lors de la suppression', err)
      });
    }
  }

  getReceiverName(): string {
    const receiver = this.users.find(user => user.id === this.receiverId);
    return receiver ? `${receiver.firstName} ${receiver.lastName}` : '';
  }

  getOnlineStatus(userId: string): void {
    this.userApiService.isUserOnline(userId).subscribe({
      next: (isOnline) => {
        this.onlineStatus[userId] = isOnline;
      },
      error: (err) => {
        console.error("Erreur de récupération du statut en ligne :", err);
      }
    });
  }

  // Initialize unread message counts for all users
  initializeUnreadMessageCounts(): void {
    if (!this.currentUserId) return;

    console.log('Initializing unread message counts for all users');

    // First, check if we have a notification parameter in the URL
    // This would indicate we came from a notification click
    const urlParams = new URLSearchParams(window.location.search);
    const notificationSenderId = urlParams.get('sender');

    if (notificationSenderId) {
      console.log(`Notification sender detected: ${notificationSenderId}`);
      // If we have a notification sender, we'll select that user automatically
      const notificationSender = this.users.find(user => user.id === notificationSenderId);
      if (notificationSender) {
        // We'll select this user after we've loaded the unread counts
        setTimeout(() => {
          this.selectUser(notificationSender);
        }, 100);
      }
    }

    // Get all users
    this.users.forEach(user => {
      if (user.id) {
        // Initialize with zero
        this.unreadMessages[user.id] = 0;

        // Get unread count from API - using the available method
        this.chatSocketService1.getMessagesBetween(user.id, this.currentUserId).subscribe({
          next: (messages: Chat[]) => {
            // Count unseen messages manually
            const unseenCount = messages.filter(msg =>
              msg.sender === user.id &&
              msg.receiver === this.currentUserId &&
              !msg.seen
            ).length;

            this.unreadMessages[user.id!] = unseenCount;
            console.log(`Unread messages from ${user.id}: ${unseenCount}`);

            // Force change detection to update the UI
            // This is important when navigating from a notification
            setTimeout(() => {}, 0);
          },
          error: (err: any) => console.error(`Error getting messages for ${user.id}:`, err)
        });
      }
    });
  }


  // Audio player methods
  private currentlyPlayingAudio: HTMLAudioElement | null = null;
  private audioDurations: Map<string, string> = new Map(); // Cache for audio durations

  toggleAudio(event: Event, audioSrc: string | undefined): void {
    if (!audioSrc) return;

    // Find the audio element
    const container = (event.target as HTMLElement).closest('.audio-container');
    if (!container) return;

    const audioElement = container.querySelector('audio');
    if (!audioElement) return;

    const playButton = container.querySelector('.audio-play-button');
    if (!playButton) return;

    const playIcon = playButton.querySelector('.play-icon');
    if (!playIcon) return;

    // If this is the currently playing audio, pause it
    if (this.currentlyPlayingAudio === audioElement) {
      if (audioElement.paused) {
        audioElement.play();
        playIcon.textContent = '⏸️';
      } else {
        audioElement.pause();
        playIcon.textContent = '▶️';
      }
    } else {
      // Stop any currently playing audio
      if (this.currentlyPlayingAudio) {
        this.currentlyPlayingAudio.pause();
        this.currentlyPlayingAudio.currentTime = 0;
        document.querySelectorAll('.play-icon').forEach(icon => {
          icon.textContent = '▶️';
        });
      }

      // Play the new audio
      audioElement.play();
      playIcon.textContent = '⏸️';
      this.currentlyPlayingAudio = audioElement;

      // When audio ends, reset the button
      audioElement.onended = () => {
        playIcon.textContent = '▶️';
        this.currentlyPlayingAudio = null;
      };
    }
  }

  // This method is replaced by the improved version below

  getAudioDuration(audioSrc: string | undefined): string {
    if (!audioSrc) return '0:00';

    // Check if we have the duration cached
    if (this.audioDurations.has(audioSrc)) {
      return this.audioDurations.get(audioSrc) || '0:00';
    }

    // Return a placeholder until the actual duration is loaded
    // We'll update this via the onAudioLoaded event
    return '0:00';
  }

  onAudioLoaded(event: Event): void {
    const audioElement = event.target as HTMLAudioElement;
    if (!audioElement || !audioElement.src) return;

    try {
      // Make sure duration is a valid number
      const durationSeconds = audioElement.duration;

      if (isFinite(durationSeconds) && !isNaN(durationSeconds)) {
        const duration = this.formatDuration(durationSeconds);
        this.audioDurations.set(audioElement.src, duration);
      } else {
        // If duration is invalid, use a default value
        this.audioDurations.set(audioElement.src, '0:15');
      }
    } catch (error) {
      console.error('Error getting audio duration:', error);
      // Set a default duration on error
      this.audioDurations.set(audioElement.src, '0:15');
    }
  }

  onAudioError(audioSrc: string | undefined): void {
    if (!audioSrc) return;
    console.error('Error loading audio:', audioSrc);
    // Set a default duration on error
    this.audioDurations.set(audioSrc, '0:15');
  }

  formatDuration(seconds: number): string {
    // Safety check for invalid values
    if (!isFinite(seconds) || isNaN(seconds)) return '0:15';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  generateWaveform(count: number): number[] {
    return Array(count).fill(0);
  }

  ngOnDestroy(): void {
    // Clear the active conversation when the component is destroyed
    localStorage.removeItem('activeConversation');
    console.log('Chat component destroyed, cleared active conversation');

    // Stop any playing audio
    if (this.currentlyPlayingAudio) {
      this.currentlyPlayingAudio.pause();
      this.currentlyPlayingAudio = null;
    }
  }
}