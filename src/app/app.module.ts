import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// BackOffice Components
import { AllTemplateBackComponent } from './BackOffice/all-template-back/all-template-back.component';
import { FooterBackComponent } from './BackOffice/footer-back/footer-back.component';
import { NavbarBackComponent } from './BackOffice/navbar-back/navbar-back.component';
import { SidebarBackComponent } from "./BackOffice/sidebar-back/sidebar-back.component";
import { CompanyComponent } from './BackOffice/company/company.component';

// FrontOffice Components
import { AllTemplateFrontComponent } from './FrontOffice/all-template-front/all-template-front.component';
import { FooterFrontComponent } from './FrontOffice/footer-front/footer-front.component';
import { HeaderFrontComponent } from './FrontOffice/header-front/header-front.component';
import { PromotionComponent } from './FrontOffice/promotion/promotion.component';
import { LeaveAddComponent } from './FrontOffice/leave/leave-add/leave-add.component';
import { LeaveslistComponent } from './FrontOffice/leave/leaveslist/leaveslist.component';
import { LeaveEditComponent } from './FrontOffice/leave/leave-edit/leave-edit.component';
import { CarpoolingComponent } from './FrontOffice/carpooling/carpooling.component';



import { ProductListComponent } from "./FrontOffice/Product/product-list/product-list.component";
import { ProductCreateComponent } from './FrontOffice/Product/product-create/product-create.component';
import { ProductEditComponent } from './FrontOffice/Product/product-edit/product-edit.component';
import { ProductDetailComponent } from "./FrontOffice/Product/product-detail/product-detail.component";


// Order & Payment Components
import { OrderCreateComponent } from "./FrontOffice/Order/order-create/order-create.component";
import { PaymentFormComponent } from "./FrontOffice/payment/payment-form/payment-form.component";

// Modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { CreateAdComponent } from './FrontOffice/Ad/create-ad/create-ad.component';

import { AdListComponent } from './FrontOffice/Ad/ad-list/ad-list.component';
import { EditAdComponent } from './FrontOffice/Ad/ad-edit/ad-edit.component';
import { ComplaintComponent } from './FrontOffice/complaint/complaint.component';

import { NgOptimizedImage } from "@angular/common";
import { ApiModule, Configuration } from './openapi';


// Services
import { AuthService } from './services/auth.service';

export function initializeKeycloak(authService: AuthService) {
  return () => authService.init();
}

const apiConfig = new Configuration({
  basePath: 'http://localhost:8089/speedygo',
  credentials: {}
});

@NgModule({
  declarations: [
    AppComponent


  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule,
    CommonModule,
    HttpClientModule,
    KeycloakAngularModule,
    NgOptimizedImage,
    AllTemplateBackComponent,
    FooterBackComponent,
    NavbarBackComponent,
    CreateAdComponent,
    AdListComponent,
    EditAdComponent,
    ComplaintComponent,
    SidebarBackComponent,
    CompanyComponent,
    AllTemplateFrontComponent,
    HeaderFrontComponent,
    FooterFrontComponent,
    PromotionComponent,
    LeaveAddComponent,
    LeaveslistComponent,
    LeaveEditComponent,
    CarpoolingComponent,
    ProductListComponent,
    ProductCreateComponent,
    ProductEditComponent,
    ProductDetailComponent,
    OrderCreateComponent,
    PaymentFormComponent,
    ApiModule.forRoot(() => apiConfig),

  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      deps: [AuthService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
