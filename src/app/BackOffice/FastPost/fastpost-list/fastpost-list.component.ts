import { Component, OnInit } from '@angular/core';
import { FastPostControllerService, FastPost } from '../../../openapi';
import { CommonModule, NgForOf } from '@angular/common';
import {NavbarBackComponent} from "../../navbar-back/navbar-back.component";
import {SidebarBackComponent} from "../../sidebar-back/sidebar-back.component";

@Component({
  selector: 'app-fastpost-list',
  imports: [CommonModule, NgForOf, NavbarBackComponent, SidebarBackComponent],
  templateUrl: './fastpost-list.component.html',
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




  acceptFastPost(fastPost: FastPost): void {
    alert('Fast post accepted: ' + fastPost.idF);
    // Optionally, implement conversion to a Delivery here.
  }

  rejectFastPost(fastPost: FastPost): void {
    alert('Fast post rejected: ' + fastPost.idF);
  }
}
