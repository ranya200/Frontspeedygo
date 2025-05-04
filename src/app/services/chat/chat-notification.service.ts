import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatControllerService } from './chat-controller.service';
import { AuthService } from '../../services/auth.service';
import { ChatSocketService } from './chat-socket.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChatNotificationService {
  private totalUnreadMessagesSubject = new BehaviorSubject<number>(0);
  totalUnreadMessages$: Observable<number> = this.totalUnreadMessagesSubject.asObservable();

  // Track the most recent sender with unread messages
  private latestSenderSubject = new BehaviorSubject<string | null>(null);
  latestSender$: Observable<string | null> = this.latestSenderSubject.asObservable();

  private currentUserId: string | null = null;
  private unreadMessages: { [userId: string]: number } = {};

  constructor(
    private chatControllerService: ChatControllerService,
    private authService: AuthService,
    private chatSocketService: ChatSocketService,
    private router: Router
  ) {
    this.initialize();
  }

  private async initialize() {
    // Get current user ID
    const isLoggedIn = await this.authService.isLoggedIn();
    if (isLoggedIn) {
      const userProfile = await this.authService.getUserProfile();
      // Use jwtDecode to get the user ID from the token
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          if (decoded && decoded.sub) {
            this.currentUserId = decoded.sub;

            // Load the latest sender from localStorage
            const latestSender = localStorage.getItem('latestMessageSender');
            if (latestSender) {
              this.latestSenderSubject.next(latestSender);
            }

            this.loadUnreadMessageCounts();
            this.subscribeToNewMessages();
            this.subscribeToMessageStatusChanges();
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    }
  }

  private loadUnreadMessageCounts() {
    if (!this.currentUserId) return;

    // Get total unread messages for the current user
    this.chatControllerService.countUnseenMessages(this.currentUserId).subscribe({
      next: (count) => {
        this.totalUnreadMessagesSubject.next(count);
        console.log(`Total unread messages: ${count}`);
      },
      error: (err) => console.error('Error getting unread message count:', err)
    });
  }

  private subscribeToNewMessages() {
    // Subscribe to new messages
    this.chatSocketService.message$.subscribe((msg) => {
      if (msg && msg.receiver === this.currentUserId && !msg.seen) {
        // Increment total unread count
        const currentTotal = this.totalUnreadMessagesSubject.value;
        this.totalUnreadMessagesSubject.next(currentTotal + 1);

        // Update individual sender count
        if (msg.sender) {
          if (!this.unreadMessages[msg.sender]) {
            this.unreadMessages[msg.sender] = 0;
          }
          this.unreadMessages[msg.sender]++;

          // Update the latest sender
          this.latestSenderSubject.next(msg.sender);

          // Store the latest sender in localStorage for persistence
          localStorage.setItem('latestMessageSender', msg.sender);
        }
      }
    });
  }

  private subscribeToMessageStatusChanges() {
    // Subscribe to message status changes (when messages are marked as seen)
    this.chatSocketService.messageStatus$.subscribe((statusUpdate) => {
      if (statusUpdate && typeof statusUpdate === 'object') {
        // If it's a bulk update notification
        if ('count' in statusUpdate && 'receiver' in statusUpdate && statusUpdate.receiver === this.currentUserId) {
          const currentTotal = this.totalUnreadMessagesSubject.value;
          const newTotal = Math.max(0, currentTotal - (statusUpdate.count as number));
          this.totalUnreadMessagesSubject.next(newTotal);

          // Update individual sender count
          if ('sender' in statusUpdate && typeof statusUpdate.sender === 'string') {
            this.unreadMessages[statusUpdate.sender] = 0;
          }
        }
        // If it's a single message update
        else if ('id' in statusUpdate && 'seen' in statusUpdate && statusUpdate.seen &&
                 'receiver' in statusUpdate && statusUpdate.receiver === this.currentUserId) {
          const currentTotal = this.totalUnreadMessagesSubject.value;
          this.totalUnreadMessagesSubject.next(Math.max(0, currentTotal - 1));

          // Update individual sender count
          if ('sender' in statusUpdate && typeof statusUpdate.sender === 'string') {
            if (this.unreadMessages[statusUpdate.sender] > 0) {
              this.unreadMessages[statusUpdate.sender]--;
            }
          }
        }
      }
    });
  }

  // Method to manually reset unread count for a specific sender
  resetUnreadCountForSender(senderId: string) {
    if (this.unreadMessages[senderId] && this.unreadMessages[senderId] > 0) {
      const currentTotal = this.totalUnreadMessagesSubject.value;
      const senderCount = this.unreadMessages[senderId];
      this.totalUnreadMessagesSubject.next(Math.max(0, currentTotal - senderCount));
      this.unreadMessages[senderId] = 0;
    }
  }

  // Method to manually refresh the total unread count
  refreshUnreadCount() {
    if (this.currentUserId) {
      this.loadUnreadMessageCounts();
    }
  }

  // Method to get the unread count for a specific sender
  getUnreadCountForSender(senderId: string): number {
    return this.unreadMessages[senderId] || 0;
  }

  // Method to get the latest sender with unread messages
  getLatestSender(): string | null {
    return this.latestSenderSubject.value;
  }

  // Method to navigate to chat with a specific sender
  navigateToChat(senderId?: string) {
    // If no sender is provided, use the latest sender
    const targetSender = senderId || this.latestSenderSubject.value;

    if (targetSender) {
      // Navigate to chat with the sender ID as a query parameter
      this.router.navigate(['/chat'], { queryParams: { sender: targetSender } });
    } else {
      // Just navigate to chat
      this.router.navigate(['/chat']);
    }
  }
}
