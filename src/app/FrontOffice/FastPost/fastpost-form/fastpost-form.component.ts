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
  standalone: true,
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
      receiverName: ['', [Validators.required,
        Validators.pattern('^[A-Za-z ]+$'), // Only letters and spaces
        Validators.maxLength(20) ]],
      receiverAddress: ['', [Validators.required,
        Validators.pattern('^[A-Za-z ]+$'), // Only letters and spaces
        Validators.minLength(5)]],
      receiverTelNbr: ['', [Validators.required,
        Validators.pattern('^[0-9]{8,}$')]],
      packageWeight: ['', [Validators.required,
        Validators.pattern('^[0-9]+$')]],
      fastPostStatus: ['PENDING']
      //packageSize: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.fastPostForm.valid) {
      // Ensure correct data types before submission
      const fastPost: FastPost = {
        ...this.fastPostForm.value,
        packageWeight: Number(this.fastPostForm.value.packageWeight) || 0, // Ensure it's a number
        receiverTelNbr: String(this.fastPostForm.value.receiverTelNbr) // Ensure it's a string
      };

      console.log('Submitting Fast Post:', fastPost); // Debugging

      this.fastPostService.addFastPost(fastPost).subscribe({
        next: (response: any) => {
          console.log('Fast post created:', response);
          alert('Fast post submitted successfully!');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error submitting fast post:', err);
          alert('An error occurred while submitting the form. Please try again.');
        }
      });

    } else {
      console.error("Form is invalid", this.fastPostForm.errors);
      alert('Please fill in all required fields correctly.');
    }
  }

  get f() {
    return this.fastPostForm.controls;
  }

}
