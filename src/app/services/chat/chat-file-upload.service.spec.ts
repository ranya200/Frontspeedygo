import { TestBed } from '@angular/core/testing';

import { ChatFileUploadService } from './chat-file-upload.service';

describe('ChatFileUploadService', () => {
  let service: ChatFileUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatFileUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
