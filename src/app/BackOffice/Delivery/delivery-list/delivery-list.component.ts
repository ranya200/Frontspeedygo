import { Component, OnInit } from '@angular/core';
import { DeliveryControllerService } from '../../../openapi';
import {NavbarBackComponent} from "../../navbar-back/navbar-back.component";
import {SidebarBackComponent} from "../../sidebar-back/sidebar-back.component";
import {RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: "app-delivery-list",
  templateUrl: './delivery-list.component.html',
  imports: [
    NavbarBackComponent,
    SidebarBackComponent,
    RouterLink,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./delivery-list.component.css']
})
export class DeliveryListComponent implements OnInit {
  deliveries: any[] = [];

  constructor(private deliveryService: DeliveryControllerService) {}

  ngOnInit(): void {
    this.loadDeliveries();
  }

  loadDeliveries(): void {
    this.deliveryService.getDeliveries().subscribe({
      next: (response) => {
        this.deliveries = response;
      },
      error: (err) => {
        console.error('Error fetching deliveries', err);
      }
    });
  }
}
