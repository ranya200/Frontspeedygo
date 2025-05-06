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
import { LeaveAddComponent } from './FrontOffice/leave/leave-add/leave-add.component';
import { LeaveslistComponent } from './FrontOffice/leave/leaveslist/leaveslist.component';
import { LeaveEditComponent } from './FrontOffice/leave/leave-edit/leave-edit.component';
import { CarpoolingComponent } from './FrontOffice/carpooling/carpooling.component';



import { ProductListComponent } from "./FrontOffice/Product/product-list/product-list.component";
import { ProductCreateComponent } from './FrontOffice/Product/product-create/product-create.component';
import { ProductEditComponent } from './FrontOffice/Product/product-edit/product-edit.component';
import { ProductDetailComponent } from "./FrontOffice/Product/product-detail/product-detail.component";
import { ClientProductListComponent} from "./FrontOffice/Product/client-product-list/client-product-list.component";

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

import { NgOptimizedImage } from "@angular/common";
import { ApiModule, Configuration } from './openapi';


// Services
import { AuthService } from './services/auth.service';
import { LeaveadminComponent } from './BackOffice/leave/leaveadmin/leaveadmin.component';
import { PromotionaddComponent } from './FrontOffice/promotion/promotionadd/promotionadd.component';
import { PromotioneditComponent } from './FrontOffice/promotion/promotionedit/promotionedit.component';
import { PromotionlistComponent } from './FrontOffice/promotion/promotionlist/promotionlist.component';
import { PackageListComponent } from './FrontOffice/package/package-list/package-list.component';
import { ComplaintAddComponent } from './FrontOffice/complaint/complaint-add/complaint-add.component';
import { ComplaintEditComponent } from './FrontOffice/complaint/complaint-edit/complaint-edit.component';
import { ComplaintListComponent } from './FrontOffice/complaint/complaint-list/complaint-list.component';
import { ComplaintDetailsComponent } from './FrontOffice/complaint/complaint-details/complaint-details.component';
import { ComplaintAdminComponent } from './BackOffice/complaint/complaint-admin/complaint-admin.component';
import { ComplaintAdminopenComponent } from './BackOffice/complaint/complaint-adminopen/complaint-adminopen.component';
import { AdDetailsComponent } from './FrontOffice/Ad/ad-details/ad-details.component';
import {StarRatingComponent} from "./FrontOffice/Product/star-rating-component/star-rating-component.component";
import {VehicleAlertComponent} from "./BackOffice/Vehicle/vehicle-alert/vehicle-alert.component";
import { ProductclientComponent } from './FrontOffice/Product/productclient/productclient.component';

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
        SidebarBackComponent,
        CompanyComponent,
        AllTemplateFrontComponent,
        HeaderFrontComponent,
        FooterFrontComponent,
        LeaveAddComponent,
        LeaveslistComponent,
        LeaveEditComponent,
        CarpoolingComponent,
        ProductListComponent,
        ProductCreateComponent,
        ProductEditComponent,
        ProductDetailComponent,
        ClientProductListComponent,
        OrderCreateComponent,
        PaymentFormComponent,
        LeaveadminComponent,
        PromotionaddComponent,
        PromotioneditComponent,
        PromotionlistComponent,
        PackageListComponent,
        ComplaintAddComponent,
        ComplaintEditComponent,
        ComplaintListComponent,
        ComplaintDetailsComponent,
        ComplaintAdminComponent,
        ComplaintAdminopenComponent,
        AdDetailsComponent,
        ApiModule.forRoot(() => apiConfig),
        StarRatingComponent
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
