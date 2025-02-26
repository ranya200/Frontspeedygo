import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FastPostControllerService, FastPost } from '../../../openapi';
import { CommonModule } from '@angular/common';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';

@Component({
  selector: 'app-fastpost-form',
  imports: [CommonModule, ReactiveFormsModule, HeaderFrontComponent, FooterFrontComponent],
  templateUrl: './fastpost-form.component.html',
  styleUrls: ['./fastpost-form.component.css']
})
export class FastpostFormComponent implements OnInit {
  fastPostForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private fastPostService: FastPostControllerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fastPostForm = this.fb.group({
      receiverName: ['', Validators.required],
      receiverAddress: ['', Validators.required],
      receiverTelNbr: ['', Validators.required],
      packageWeight: ['', Validators.required],
      //packageSize: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.fastPostForm.valid) {
      const fastPost: FastPost = this.fastPostForm.value;
      this.fastPostService.addFastPost(fastPost).subscribe({
        next: (response: any) => {
          console.log('Fast post created', response);
          alert('Fast post submitted successfully!');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error submitting fast post', err);
        }
      });
    } else {
      console.error("Form is invalid");
    }
  }

}
