import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import  SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { Chat } from 'src/app/models/chat.model'; // Use our custom Chat interface
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatSocketService {
  private stompClient!: Client;
  private messageSubject = new BehaviorSubject<Chat | null>(null);
  public message$ = this.messageSubject.asObservable();

  // Message status updates
  private messageStatusSubject = new BehaviorSubject<any>(null);
  public messageStatus$ = this.messageStatusSubject.asObservable();

  // Track user connections
  private userConnections: Map<string, boolean> = new Map();

  constructor(private http: HttpClient) {
    this.initializeWebSocketConnection();
  }

  // Initialize WebSocket connection
  initializeWebSocketConnection(): void {
    this.stompClient = new Client({
      webSocketFactory: () => {
        const token = localStorage.getItem('token');
        console.log('📤 Token utilisé pour WebSocket :', token);
        return new SockJS(`http://localhost:8089/speedygo/ws?access_token=${token}`);
      },
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = () => {
      console.log("WebSocket connected.");

      // Subscribe to the chat messages
      this.stompClient.subscribe('/topic/public', (message: IMessage) => {
        const chatObj: Chat = JSON.parse(message.body);
        this.messageSubject.next(chatObj);
      });

      // Subscribe to message status updates
      this.stompClient.subscribe('/topic/messageStatus', (message: IMessage) => {
        const statusUpdate = JSON.parse(message.body);
        console.log('Message status update:', statusUpdate);
        this.messageStatusSubject.next(statusUpdate);
      });

      // Track user connection status
      this.stompClient.subscribe('/topic/online-status', (message: IMessage) => {
        const userStatus = JSON.parse(message.body);
        // Use userId and online properties from the backend DTO
        this.userConnections.set(userStatus.userId, userStatus.online);
        console.log(`User ${userStatus.userId} is ${userStatus.online ? 'online' : 'offline'}`);
      });
    };

    this.stompClient.activate();
  }

  // Send message through WebSocket
  sendMessage(chat: Chat): void {
    this.stompClient.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(chat),
    });
  }

  // Upload file and send the file message
  uploadFileAndSendMessage(formData: FormData): Observable<string> {
    return this.http.post('http://localhost:8089/speedygo/api/chat/upload', formData, {
      responseType: 'text', // Expecting a URL for the file
    });
  }

  // Check if the user is online
  isUserOnline(userId: string): boolean {
    const isOnline = this.userConnections.get(userId) || false;
    console.log(`Checking online status for user ${userId}: ${isOnline}`);
    return isOnline;
  }

  // Mark a message as seen via WebSocket
  markMessageAsSeen(messageId: string): void {
    if (!this.stompClient) {
      console.error('STOMP client not initialized');
      return;
    }

    const message = {
      id: messageId
    };

    this.stompClient.publish({
      destination: '/app/chat.markAsSeen',
      body: JSON.stringify(message)
    });
  }

  // Mark all messages from a sender as seen
  markAllMessagesAsSeen(sender: string, receiver: string): void {
    if (!this.stompClient) {
      console.error('STOMP client not initialized');
      return;
    }

    const payload = {
      sender: sender,
      receiver: receiver
    };

    this.stompClient.publish({
      destination: '/app/chat.markAllAsSeen',
      body: JSON.stringify(payload)
    });
  }
}
