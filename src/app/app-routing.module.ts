import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import {AllTemplateFrontComponent} from "./FrontOffice/all-template-front/all-template-front.component";
import {AllTemplateBackComponent} from "./BackOffice/all-template-back/all-template-back.component";

import { CreateAdComponent } from './FrontOffice/Ad/create-ad/create-ad.component';
import { AdListComponent } from './FrontOffice/Ad/ad-list/ad-list.component';
import { EditAdComponent } from './FrontOffice/Ad/ad-edit/ad-edit.component';
import { ComplaintComponent } from './FrontOffice/complaint/complaint.component';


import { PromotionComponent } from './FrontOffice/promotion/promotion.component';
import { LeaveAddComponent } from './FrontOffice/leave/leave-add/leave-add.component';
import { LeaveslistComponent } from './FrontOffice/leave/leaveslist/leaveslist.component';
import { LeaveEditComponent } from './FrontOffice/leave/leave-edit/leave-edit.component';

import { CarpoolingComponent } from './FrontOffice/carpooling/carpooling.component';
import { CompanyComponent } from './BackOffice/company/company.component';

import {ProductListComponent} from "./FrontOffice/Product/product-list/product-list.component";
import { ProductCreateComponent } from './FrontOffice/Product/product-create/product-create.component';
import { ProductEditComponent } from './FrontOffice/Product/product-edit/product-edit.component';
import {OrderCreateComponent} from "./FrontOffice/Order/order-create/order-create.component";
import {PaymentFormComponent} from "./FrontOffice/payment/payment-form/payment-form.component";
import {ProductDetailComponent} from "./FrontOffice/Product/product-detail/product-detail.component";

import {VehicleListComponent} from "./BackOffice/Vehicle/vehicle-list/vehicle-list.component";
import {VehicleFormClientComponent} from "./FrontOffice/Vehicle/vehicle-form-client/vehicle-form-client.component";
import {VehicleFormAdminComponent} from "./BackOffice/Vehicle/vehicle-form-admin/vehicle-form-admin.component";
import {
  VehicleFormDelivaryComponent
} from "./FrontOffice/Vehicle/vehicle-form-delivary/vehicle-form-delivary.component";
import {DeliveryAssignmentComponent} from "./BackOffice/Delivery/delivery-assignment/delivery-assignment.component";
import {DriverDeliveryComponent} from "./FrontOffice/Delivery/driver-delivery/driver-delivery.component";
import {
  UserDeliveryTrackingComponent
} from "./FrontOffice/Delivery/user-delivery-tracking/user-delivery-tracking.component";
import {FastpostFormComponent} from "./FrontOffice/FastPost/fastpost-form/fastpost-form.component";
import {FastpostListComponent} from "./BackOffice/FastPost/fastpost-list/fastpost-list.component";
import {VehicleEditComponent} from "./BackOffice/Vehicle/vehicle-edit/vehicle-edit.component";
import {DeliveryListComponent} from "./BackOffice/Delivery/delivery-list/delivery-list.component";

import { adminGuard } from './guards/admin.guard';
import { clientGuard } from './guards/client.guard';
import { driverGuard } from './guards/driver.guard';
import { visitorGuard } from './guards/visitor.guard';
import { partnerGuard } from './guards/partner.guard';

const routes: Routes = [
  { path: '', component: AllTemplateFrontComponent},
  { path: 'product', component: ProductListComponent , canActivate: [clientGuard]},
  { path: 'create-product', component: ProductCreateComponent , canActivate: [partnerGuard]},
  { path: 'product-detail/:id', component: ProductDetailComponent},
  { path: 'edit-product/:id', component: ProductEditComponent},
  { path: 'create-order', component: OrderCreateComponent },
  { path: 'payment' , component: PaymentFormComponent},
  { path: 'carpooling', component: CarpoolingComponent},
  { path: 'company', component: CompanyComponent },
  { path: 'leave', component: LeaveslistComponent},
  { path: 'leaveadd', component: LeaveAddComponent , canActivate: [driverGuard]},
  { path: 'leaveedit/:id', component: LeaveEditComponent},
  { path: 'promo', component: PromotionComponent},
  { path: 'adlist', component: AdListComponent},
  { path: 'complaint', component: ComplaintComponent},
  { path: 'editad/:id', component: EditAdComponent },  // Modified to accept an 'id' parameter
  { path: 'crad', component: CreateAdComponent },
  // Vehicle Routes
  { path: 'vehicles', component: VehicleListComponent },
  { path: 'vehicles/new', component: VehicleFormClientComponent },
  { path: 'admin/vehicles/new', component: VehicleFormAdminComponent },
  { path: 'edit-vehicle/:id', component: VehicleEditComponent },
  { path: 'driver/vehicles/new', component: VehicleFormDelivaryComponent },
  // Delivery Routes
  { path: 'deliveries/assign', component: DeliveryAssignmentComponent },
  { path: 'deliveries', component: DeliveryListComponent },
  { path: 'deliveries/driver', component: DriverDeliveryComponent },
  { path: 'deliveries/user', component: UserDeliveryTrackingComponent },
  // FastPost Routes
  { path: 'fastposts/new', component: FastpostFormComponent },
  { path: 'fastposts', component: FastpostListComponent },

  { path: 'admin', component: AllTemplateBackComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
