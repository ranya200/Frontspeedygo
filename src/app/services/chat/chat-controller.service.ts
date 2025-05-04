import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chat } from 'src/app/models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatControllerService {
  private baseUrl = 'http://localhost:8089/speedygo/api/chat';

  constructor(private http: HttpClient) { }

  getAllMessages(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.baseUrl}/all`);
  }

  getMessagesBySender(sender: string): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.baseUrl}/sender/${sender}`);
  }

  getMessagesBetween(user1: string, user2: string): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.baseUrl}/between/${user1}/${user2}`);
  }

  deleteMessage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // New methods for seen functionality
  getUnseenMessages(receiver: string): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.baseUrl}/unseen/${receiver}`);
  }

  countUnseenMessages(receiver: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/unseen/count/${receiver}`);
  }

  countUnseenMessagesBySenderAndReceiver(sender: string, receiver: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/unseen/count/${sender}/${receiver}`);
  }

  markMessageAsSeen(messageId: string): Observable<Chat> {
    return this.http.put<Chat>(`${this.baseUrl}/seen/${messageId}`, {});
  }

  markAllMessagesAsSeen(sender: string, receiver: string): Observable<Chat[]> {
    return this.http.put<Chat[]>(`${this.baseUrl}/seen/all/${sender}/${receiver}`, {});
  }
}
