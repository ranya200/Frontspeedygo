import { Component, OnInit } from '@angular/core';
import { DeliveryControllerService } from '../../../openapi';
import { NavbarBackComponent } from "../../navbar-back/navbar-back.component";
import { SidebarBackComponent } from "../../sidebar-back/sidebar-back.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-delivery-list",
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.css'],
  standalone: true,
  imports: [
    NavbarBackComponent,
    SidebarBackComponent,
    NgForOf,
    RouterLink,
    NgClass,
    NgIf
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
          console.log("🚗 Deliveries Loaded:", this.deliveries);
        } catch (error) {
          console.error("❌ Error parsing delivery data:", error);
        }
      },
      error: (err) => {
        console.error('❌ Error fetching deliveries:', err);
        alert("⚠️ Failed to load deliveries. Please try again.");
      }
    });
  }

  deleteDelivery(deliveryId: string | undefined): void {
    if (!deliveryId || deliveryId === "string") { // ✅ Prevent sending "string" as ID
      alert("❌ Invalid Delivery ID!");
      return;
    }

    if (confirm("Are you sure you want to delete this delivery?")) {
      console.log(`🗑️ Sending DELETE request for ID: ${deliveryId}`);

      this.deliveryService.removeDelivery(deliveryId).subscribe({
        next: () => {
          console.log(`✅ Delivery ${deliveryId} deleted successfully.`);
          this.deliveries = this.deliveries.filter(d => d.idD !== deliveryId); // ✅ Remove from UI
          alert("🚀 Delivery deleted successfully!");
        },
        error: (err) => {
          console.error("❌ Error deleting delivery:", err);
          alert(`⚠️ Error deleting delivery: ${err.error || "Unknown error"}`);
        }
      });
    }
  }


}
