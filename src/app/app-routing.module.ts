import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import {AllTemplateFrontComponent} from "./FrontOffice/all-template-front/all-template-front.component";
import {AllTemplateBackComponent} from "./BackOffice/all-template-back/all-template-back.component";
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

const routes: Routes = [
  { path: '', component: AllTemplateFrontComponent },
  { path: 'product', component: ProductListComponent },
  { path: 'create-product', component: ProductCreateComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  { path: 'edit-product/:id', component: ProductEditComponent },
  { path: 'create-order', component: OrderCreateComponent },
  { path: 'payment' , component: PaymentFormComponent },
  // Vehicle Routes
  { path: 'vehicles', component: VehicleListComponent },
  { path: 'vehicles/new', component: VehicleFormClientComponent },
  { path: 'admin/vehicles/new', component: VehicleFormAdminComponent },
  { path: 'driver/vehicles/new', component: VehicleFormDelivaryComponent },
  // Delivery Routes
  { path: 'deliveries/assign', component: DeliveryAssignmentComponent },
  { path: 'deliveries/driver', component: DriverDeliveryComponent },
  { path: 'deliveries/user', component: UserDeliveryTrackingComponent },
  // FastPost Routes
  { path: 'fastposts/new', component: FastpostFormComponent },
  { path: 'fastposts', component: FastpostListComponent },
  { path: 'admin', component: AllTemplateBackComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
