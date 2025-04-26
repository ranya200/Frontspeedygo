import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatFileUploadService {
  private uploadUrl = 'http://localhost:8089/speedygo/chat/upload';

  constructor(private http: HttpClient) {}

  uploadFile(fileData: FormData): Observable<string> {
    return this.http.post(this.uploadUrl, fileData, {
      responseType: 'text'
    });
  }
}
