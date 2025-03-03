import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FastPostControllerService, FastPost} from '../../../openapi';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarBackComponent } from "../../navbar-back/navbar-back.component";
import { SidebarBackComponent } from "../../sidebar-back/sidebar-back.component";


@Component({
  selector: 'app-fastpost-edit',
  imports: [
    CommonModule, // ✅ Required for `*ngFor`
    FormsModule, // ✅ Ensure FormsModule is included
    ReactiveFormsModule,
    NavbarBackComponent,
    SidebarBackComponent
  ],
  templateUrl: './fastpost-edit.component.html',
  standalone: true,
  styleUrl: './fastpost-edit.component.css'
})
export class FastpostEditComponent implements OnInit {
  fastPostForm!: FormGroup;
  fastPosts: FastPost[] = [];
  fastPostId!: string;
  selectedFastPost: any = null;
  fastPostStatus = ['PENDING', 'APPROVED', 'REJECTED'];

  constructor(
    private fastPostService: FastPostControllerService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ){}
  ngOnInit(): void {
    this.fastPostForm = this.fb.group({
      idF: [''],
      receiverName: ['', Validators.required],
      receiverAddress: ['', Validators.required],
      receiverTelNbr: ['', Validators.required],
      packageWeight: ['', Validators.required],
      fastPostStatus: ['', Validators.required]
      //packageSize: ['', Validators.required]
    });

    this.fastPostId = this.route.snapshot.paramMap.get('id') || '';

    // Check if vehicleId exists
    if (!this.fastPostId) {
      alert('❌ request ID not found!');
      this.router.navigate(['/fastposts']); // Redirect if ID is missing
    } else {
      // Load the vehicle details using the vehicle ID
      this.loadFastPost();
    }
  }

  loadFastPost(): void {
    this.fastPostService.getFastPost(this.fastPostId).subscribe({

      next: async (response) => {
        if (response instanceof Blob) {
          const text = await response.text(); // Convert Blob to text
          const fastpost = JSON.parse(text);
          this.fastPostForm.patchValue(fastpost);
        } else {
          this.fastPostForm.patchValue(response);
        }
        console.log('Form Valid After Patch:', this.fastPostForm.valid);
        console.log('Form Values:', this.fastPostForm.value);

      },
      error: (err) => console.error('Error ', err)
    });
  }

  onSubmit(): void {
    console.log('Form Valid:', this.fastPostForm.valid); // Check the validity
    console.log('Form Values:', this.fastPostForm.value); // Log form values
    if (this.fastPostForm.valid) {
      const formValue = this.fastPostForm.value;
      const updatedDelivery: FastPost = {
        receiverName: formValue.receiverName,
        receiverAddress: formValue.receiverAddress,
        receiverTelNbr: formValue.receiverTelNbr,
        packageWeight: formValue.packageWeight,
        fastPostStatus: formValue.fastPostStatus,
      };
      this.fastPostService.modifyFastPost(this.fastPostId, updatedDelivery).subscribe({
        next: (response) => {
          console.log('✅ Vehicle updated successfully:', response);
          alert('FastPost updated successfully!');
          this.router.navigate(['/fastposts']);  // Redirect to the vehicle list page
        },
        error: (err) => {
          console.error('❌ Error updating fastPost:', err);
          alert('Failed to update fastPost. Please try again.');
        }
      });
    } else {
      console.error('❌ Form is invalid!');
      for (const controlName in this.fastPostForm.controls) {
        if (this.fastPostForm.controls[controlName].invalid) {
          console.log(`${controlName} is invalid`);
        }
      }
      alert('Please fill in all the required fields.');
    }
  }
  cancelEdit(): void {
    this.router.navigate(['/fastposts']); // Navigate back to the list
  }


}
