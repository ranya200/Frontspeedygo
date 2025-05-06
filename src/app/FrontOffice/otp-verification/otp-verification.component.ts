import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NgxOtpInputComponent} from "ngx-otp-input";
import {HeaderFrontComponent} from "../header-front/header-front.component";
import {FooterFrontComponent} from "../footer-front/footer-front.component";

@Component({
  selector: 'app-otp-verification',
  imports: [
    NgxOtpInputComponent , HeaderFrontComponent, FooterFrontComponent
  ],
  template: `
    <ngx-otp-input [config]="config" (onInputChange)="onOtpChange($event)"></ngx-otp-input>
    <button (click)="verifyOtp()">Verify OTP</button>
    <p *ngIf="message">{{ message }}</p>
  `
})
export class OtpVerificationComponent {
  config = {
    length: 6,
    inputClass: 'otp-input'
  };
  otp: string = '';
  message: string = '';

  constructor(private http: HttpClient) {}

  onOtpChange(otp: string) {
    this.otp = otp;
  }

  verifyOtp() {
    const phoneNumber = '+21629701567'; // Remplacez par le numéro de téléphone de l'utilisateur
    this.http.post('/api/otp/verify', { phoneNumber, code: this.otp })
      .subscribe(
        () => this.message = 'OTP verified successfully',
        () => this.message = 'Invalid OTP'
      );
  }
}
