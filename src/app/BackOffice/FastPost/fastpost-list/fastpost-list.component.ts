import { Component, OnInit } from '@angular/core';
import {FastPostControllerService, FastPost} from '../../../openapi';
import { CommonModule, NgForOf } from '@angular/common';
import {NavbarBackComponent} from "../../navbar-back/navbar-back.component";
import {SidebarBackComponent} from "../../sidebar-back/sidebar-back.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-fastpost-list',
  imports: [CommonModule, NgForOf, NavbarBackComponent, SidebarBackComponent, RouterLink],
  templateUrl: './fastpost-list.component.html',
  standalone: true,
  styleUrls: ['./fastpost-list.component.css']
})
export class FastpostListComponent implements OnInit {
  fastPosts: FastPost[] = [];

  constructor(private fastPostService: FastPostControllerService) {}

  ngOnInit(): void {
    this.loadFastPosts();
  }

  loadFastPosts(): void {
    this.fastPostService.getFastPosts().subscribe({
      next:  async (response) => {
        if (response instanceof Blob) {
          const text = await response.text(); // Convertir Blob en texte
          this.fastPosts = JSON.parse(text); // Convertir en JSON
        } else {
          this.fastPosts = response; // Déjà un tableau JSON
        }
        console.log("Données reçues :", this.fastPosts);
      },
      error: (err) => console.error('Erreur lors de la récupération des congés', err)
    });
  }




  approveFastPost(fastPost :FastPost): void {
    if (confirm("whould you accept this fastPost Deliver  ?")) {
      this.fastPostService.approveFastPost(fastPost.idF!).subscribe({
        next: () => {
          alert("The fastpost deliver is accepted !");
          this.loadFastPosts(); // Refresh the list
        },
        error: (err) => console.error("Error", err)
      });
    }
  }

  rejectFastPost(fastPost :FastPost): void {
    if (confirm("whould you accept this fastPost Deliver  ?")) {
      this.fastPostService.rejectFastPost(fastPost.idF!).subscribe({
        next: () => {
          alert("The fastpost deliver is rejected !");
          this.loadFastPosts(); // Refresh the list
        },
        error: (err) => console.error("Error", err)
      });
    }
  }

  deleteFastPost(FastPostId: string | undefined): void {
    if (confirm("Are you sure you want to delete this deliver add request?")) {
      if (typeof FastPostId === "string") {
        this.fastPostService.removeFastPost(FastPostId).subscribe({
          next: () => {
            this.fastPosts = this.fastPosts.filter(fp => fp.idF !== FastPostId);
            console.log(`🗑️ Vehicle ${FastPostId} deleted successfully.`);
          },
          error: (err) => console.error("❌ Error deleting this request:", err),
        });
      }
    }
  }
}
