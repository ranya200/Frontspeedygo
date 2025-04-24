import { Component, OnInit } from '@angular/core';
import { ProductControllerService, Product } from '../../../openapi';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import { Router } from '@angular/router';
import {HeaderFrontComponent} from "../../header-front/header-front.component";
import {FooterFrontComponent} from "../../footer-front/footer-front.component";

interface ExtendedProduct extends Product {
  selectedQuantity?: number;
}

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  imports: [CommonModule,
    FormsModule, HeaderFrontComponent, FooterFrontComponent
  ],
  styleUrls: ['./order-create.component.css']
})
export class OrderCreateComponent {
}
