import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import  SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { Chat } from 'src/app/openapi'; // À adapter selon ton projet
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatSocketService {
  private stompClient!: Client;
  private messageSubject = new BehaviorSubject<Chat | null>(null);
  public message$ = this.messageSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection(): void {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8089/speedygo/ws'),
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = () => {
      this.stompClient.subscribe('/topic/public', (message: IMessage) => {
        const chatObj: Chat = JSON.parse(message.body);
        this.messageSubject.next(chatObj);
      });
    };

    this.stompClient.activate();
  }

  sendMessage(chat: Chat): void {
    this.stompClient.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(chat),
    });
  }

  uploadFileAndSendMessage(formData: FormData): Observable<string> {
    return this.http.post('http://localhost:8089/speedygo/api/chat/upload', formData, {
      responseType: 'text' // 👈 attend une chaîne (l'URL du fichier)
    });
  }
  
  
}
