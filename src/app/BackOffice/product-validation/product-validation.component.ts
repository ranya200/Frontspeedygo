import { Component, OnInit } from '@angular/core';
import { ProductControllerService, Product } from 'src/app/openapi';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {NavbarBackComponent} from "../navbar-back/navbar-back.component";
import {SidebarBackComponent} from "../sidebar-back/sidebar-back.component";
import {FooterBackComponent} from "../footer-back/footer-back.component";

@Component({
  selector: 'app-product-validation',
  templateUrl: './product-validation.component.html',
  styleUrls: ['./product-validation.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarBackComponent, SidebarBackComponent]
})
export class ProductValidationComponent implements OnInit {
  pendingProducts: Product[] = [];

  constructor(private productService: ProductControllerService) {}

  ngOnInit(): void {
    this.loadPendingProducts();
  }

  loadPendingProducts(): void {
    this.productService.getPendingProducts().subscribe((blob: any) => {
      const reader = new FileReader();

      reader.onload = () => {
        const json = JSON.parse(reader.result as string);
        this.pendingProducts = json;
        console.log('✅ Produits chargés :', json);
      };

      reader.readAsText(blob);
    });
  }


  approveProduct(id: string): void {
    this.productService.approveProduct(id).subscribe(() => {
      this.loadPendingProducts();
    });
  }

  rejectProduct(id: string): void {
    this.productService.rejectProduct(id).subscribe(() => {
      this.loadPendingProducts();
    });
  }
}
