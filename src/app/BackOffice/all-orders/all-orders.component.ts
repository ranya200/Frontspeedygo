import { Component, OnInit } from '@angular/core';
import { OrderControllerService, Order } from 'src/app/openapi';
import {NavbarBackComponent} from "../navbar-back/navbar-back.component";
import {SidebarBackComponent} from "../sidebar-back/sidebar-back.component";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css'],
  standalone: true,
  imports: [
    NavbarBackComponent,
    SidebarBackComponent,CommonModule
  ]
})
export class AllOrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: OrderControllerService) {}

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe((blob: any) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result as string);
          this.orders = json;
          console.log('📦 Commandes chargées :', json);
        } catch (e) {
          console.error('❌ Erreur parsing commandes :', e);
        }
      };
      reader.readAsText(blob);
    });
  }
}
