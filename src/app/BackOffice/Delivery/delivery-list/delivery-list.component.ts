import { Component, OnInit } from '@angular/core';
import { DeliveryControllerService } from '../../../openapi';
import {NavbarBackComponent} from "../../navbar-back/navbar-back.component";
import {SidebarBackComponent} from "../../sidebar-back/sidebar-back.component";
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: "app-delivery-list",
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.css'],
  imports: [
    NavbarBackComponent,
    SidebarBackComponent,
    NgForOf,
    RouterLink
  ]
})
export class DeliveryListComponent implements OnInit {
  deliveries: any[] = [];

  constructor(private deliveryService: DeliveryControllerService) {}

  ngOnInit(): void {
    this.loadDeliveries();
  }

  loadDeliveries(): void {
    this.deliveryService.getdeliveries().subscribe({
      next: async (response) => {
        try {
          if (response instanceof Blob) {
            const text = await response.text();
            this.deliveries = JSON.parse(text);
          } else {
            this.deliveries = response;
          }
          console.log("🚗 Delivaries Loaded:", this.deliveries);
        } catch (error) {
          console.error("❌ Error parsing vehicle data:", error);
        }
      },
      error: (err) => {
        console.error('Error fetching deliveries', err);
      }
    });
  }

  deleteDelivery(deliveryId: string | undefined): void {
    if (!deliveryId) {
      console.error("❌ Invalid delivery ID:", deliveryId);
      alert("⚠️ Error: Invalid delivery ID.");
      return;
    }

    if (confirm("Are you sure you want to delete this delivery?")) {
      console.log(`🗑️ Deleting delivery with ID: ${deliveryId}`);

      this.deliveryService.removeDelivery(deliveryId).subscribe({
        next: (response) => {
          console.log(`✅ Successfully deleted delivery:`, response);

          // ✅ Check if idD is the correct field
          this.deliveries = this.deliveries.filter(d => d.idD !== deliveryId);
          alert("🚀 Delivery deleted successfully!");
        },
        error: (err) => {
          console.error("❌ Error deleting delivery:", err);
          alert("⚠️ Failed to delete delivery. Check console for details.");
        }
      });
    }
  }


}
