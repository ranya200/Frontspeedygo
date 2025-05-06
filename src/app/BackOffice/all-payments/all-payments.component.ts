import { Component, OnInit } from '@angular/core';
import { PaymentControllerService, Payment } from 'src/app/openapi';
import {CommonModule} from "@angular/common";
import {NavbarBackComponent} from "../navbar-back/navbar-back.component";
import {SidebarBackComponent} from "../sidebar-back/sidebar-back.component";

@Component({
  selector: 'app-all-payments',
  templateUrl: './all-payments.component.html',
  styleUrls: ['./all-payments.component.css'],
  standalone: true,
  imports: [CommonModule, NavbarBackComponent, SidebarBackComponent]
})
export class AllPaymentsComponent implements OnInit {
  payments: any[] = [];

  constructor(private paymentService: PaymentControllerService) {}

  ngOnInit(): void {
    this.paymentService.getAllPayments().subscribe((blob: any) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result as string);
          this.payments = json;
          console.log('✅ Paiements chargés :', json);
        } catch (e) {
          console.error('❌ Erreur de parsing JSON:', e);
        }
      };
      reader.readAsText(blob);
    });
  }
}
