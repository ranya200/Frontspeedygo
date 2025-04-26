import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chat, ChatControllerService, User, UserControllerService } from 'src/app/openapi';
import { ChatSocketService } from 'src/app/services/chat/chat-socket.service';
import { ChatFileUploadService } from 'src/app/services/chat/chat-file-upload.service';
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
export class ChatComponent implements OnInit {
  message = '';
  messages: Chat[] = [];
  currentUserId!: string;
  receiverId!: string;
  currentUser: string = 'You';
  selectedReceiver: string = '';
  users: User[] = [];
  selectedFile?: File;
  messageToDelete?: Chat;
  confirmDeleteMessage = false;
  isRecording = false;
  recordedAudioBlob?: Blob;
  mediaRecorder?: MediaRecorder;
  audioChunks: Blob[] = [];

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('waveCanvas', { static: false }) waveCanvas!: ElementRef<HTMLCanvasElement>;

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
  ) {}

  ngOnInit(): void {
    this.chatSocketService.message$.subscribe((msg) => {
      if (msg) this.messages.push(msg);
    });

    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.currentUserId = decoded.sub;
      this.currentUser = decoded.preferred_username || 'You';
    }

    this.getAllOtherUsers();
  }

  getAllOtherUsers(): void {
    this.userApiService.getAllOtherUsers().subscribe({
      next: async (res) => {
        this.users = res instanceof Blob ? JSON.parse(await res.text()) : res;
      },
      error: (err) => console.error('Erreur chargement utilisateurs', err)
    });
  }

  selectUser(user: User): void {
    this.receiverId = user.id!;
    this.selectedReceiver = user.id!;

    if (this.currentUserId && this.receiverId) {
      this.loadMessagesBetween(this.currentUserId, this.receiverId);
    } else {
      console.warn('Utilisateur courant ou destinataire non défini.');
    }
  }

  loadMessagesBetween(senderId: string, receiverId: string): void {
    this.chatSocketService1.getMessagesBetween(senderId, receiverId).subscribe({
      next: async (res) => {
        this.messages = res instanceof Blob ? JSON.parse(await res.text()) : res;
      },
      error: err => console.error('Erreur chargement messages entre users', err)
    });
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
            timestamp: new Date().toISOString()
          };
          this.chatSocketService.sendMessage(chatMessage);
          this.recordedAudioBlob = undefined;
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
            timestamp: new Date().toISOString()
          };
          this.chatSocketService.sendMessage(chatMessage);
          this.selectedFile = undefined;
          this.fileInputRef.nativeElement.value = '';
          this.message = '';
        },
        error: (err) => console.error("Erreur fichier :", err)
      });
    } else if (this.message.trim()) {
      const chatMessage: Chat = {
        sender: this.currentUserId,
        receiver: this.receiverId,
        content: this.message,
        timestamp: new Date().toISOString()
      };
      this.chatSocketService.sendMessage(chatMessage);
      this.message = '';
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
          timestamp: new Date().toISOString()
        };
        this.chatSocketService.sendMessage(chatMessage);
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
}
