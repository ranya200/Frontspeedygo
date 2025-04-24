import { Component, OnInit } from '@angular/core';
import { DeliveryControllerService } from '../../../openapi';
import { NavbarBackComponent } from "../../navbar-back/navbar-back.component";
import { SidebarBackComponent } from "../../sidebar-back/sidebar-back.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import { RouterLink } from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

enum PamentStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
}

@Component({
  selector: "app-delivery-list",
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.css'],
  standalone: true,
  imports: [
    SidebarBackComponent,
    NavbarBackComponent,
    NgForOf,
    RouterLink,
    NgClass,
    NgIf,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class DeliveryListComponent implements OnInit {
  deliveries: any[] = [];
  fastPostStatus = ['PENDING', 'APPROVED', 'REJECTED'];
  searchPamentStatus: PamentStatus = PamentStatus.PAID;
  pamentStatuses = Object.values(PamentStatus);

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
  search() {
    console.log("🔍 Searching for pamentStatus:", this.searchPamentStatus);

    this.deliveryService.searchDeliveries(this.searchPamentStatus).subscribe(
      (data: any) => {
        console.log("✅ Received response:", data);

        if (data instanceof Blob) {
          console.error("❌ ERROR: Received Blob instead of JSON! Possible backend issue.");
          return;
        }

        if (!Array.isArray(data)) {
          console.error("❌ ERROR: Unexpected response format! Expected an array.");
          return;
        }

        this.deliveries = data;
      },
      error => {
        console.error("❌ API Error:", error);
        if (error.status === 400) {
          console.error("❌ Backend rejected the request. Possible enum conversion issue.");
        }
      }
    );
  }

}
