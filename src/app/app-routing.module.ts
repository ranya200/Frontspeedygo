import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import {AllTemplateFrontComponent} from "./FrontOffice/all-template-front/all-template-front.component";
import {AllTemplateBackComponent} from "./BackOffice/all-template-back/all-template-back.component";

import { CreateAdComponent } from './FrontOffice/Ad/create-ad/create-ad.component';
import { AdListComponent } from './FrontOffice/Ad/ad-list/ad-list.component';
import { EditAdComponent } from './FrontOffice/Ad/ad-edit/ad-edit.component';


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
import { LeaveadminComponent } from './BackOffice/leave/leaveadmin/leaveadmin.component';
import { PromotionlistComponent } from './FrontOffice/promotion/promotionlist/promotionlist.component';
import { PromotionaddComponent } from './FrontOffice/promotion/promotionadd/promotionadd.component';
import { PromotioneditComponent } from './FrontOffice/promotion/promotionedit/promotionedit.component';
import { PackageListComponent } from './FrontOffice/package/package-list/package-list.component';
import { ComplaintListComponent } from './FrontOffice/complaint/complaint-list/complaint-list.component';
import { ComplaintAddComponent } from './FrontOffice/complaint/complaint-add/complaint-add.component';
import { ComplaintEditComponent } from './FrontOffice/complaint/complaint-edit/complaint-edit.component';
import { ComplaintDetailsComponent } from './FrontOffice/complaint/complaint-details/complaint-details.component';
import { ComplaintAdminComponent } from './BackOffice/complaint/complaint-admin/complaint-admin.component';
import { ComplaintAdminopenComponent } from './BackOffice/complaint/complaint-adminopen/complaint-adminopen.component';
import { AdDetailsComponent } from './FrontOffice/Ad/ad-details/ad-details.component';
import {VehicleListComponent} from "./BackOffice/Vehicle/vehicle-list/vehicle-list.component";
import {VehicleFormClientComponent} from "./FrontOffice/Vehicle/vehicle-form-client/vehicle-form-client.component";
import {VehicleFormAdminComponent} from "./BackOffice/Vehicle/vehicle-form-admin/vehicle-form-admin.component";
import { VehicleFormDelivaryComponent} from "./FrontOffice/Vehicle/vehicle-form-delivary/vehicle-form-delivary.component";
import {DeliveryAssignmentComponent} from "./BackOffice/Delivery/delivery-assignment/delivery-assignment.component";
import {DriverDeliveryComponent} from "./FrontOffice/Delivery/driver-delivery/driver-delivery.component";
import { UserDeliveryTrackingComponent} from "./FrontOffice/Delivery/user-delivery-tracking/user-delivery-tracking.component";
import {FastpostFormComponent} from "./FrontOffice/FastPost/fastpost-form/fastpost-form.component";
import {FastpostListComponent} from "./BackOffice/FastPost/fastpost-list/fastpost-list.component";
import {VehicleEditComponent} from "./BackOffice/Vehicle/vehicle-edit/vehicle-edit.component";
import {DeliveryListComponent} from "./BackOffice/Delivery/delivery-list/delivery-list.component";
import {FastpostEditComponent} from "./BackOffice/FastPost/fastpost-edit/fastpost-edit.component";
import {DeliveryEditComponent} from "./BackOffice/Delivery/delivery-edit/delivery-edit.component";
import { adminGuard } from './guards/admin.guard';
import { clientGuard } from './guards/client.guard';
import { driverGuard } from './guards/driver.guard';
import { visitorGuard } from './guards/visitor.guard';
import { partnerGuard } from './guards/partner.guard';

const routes: Routes = [
  { path: '', component: AllTemplateFrontComponent},
  { path: 'product', component: ProductListComponent , canActivate: [clientGuard]},
  { path: 'create-product', component: ProductCreateComponent , canActivate: [partnerGuard]},
  { path: 'product-detail/:id', component: ProductDetailComponent, canActivate: [clientGuard]},
  { path: 'edit-product/:id', component: ProductEditComponent, canActivate: [partnerGuard]},
  { path: 'create-order', component: OrderCreateComponent, canActivate: [clientGuard] },
  { path: 'payment' , component: PaymentFormComponent, canActivate: [clientGuard]},
  { path: 'carpooling', component: CarpoolingComponent, canActivate: [clientGuard]},
  { path: 'company', component: CompanyComponent, canActivate: [adminGuard] },
  { path: 'leaveadmin', component: LeaveadminComponent , canActivate: [adminGuard]},
  { path: 'promoadd', component: PromotionaddComponent },
  { path: 'promoedit/:id', component: PromotioneditComponent },
  { path: 'package', component: PackageListComponent , canActivate: [clientGuard]},
  { path: 'complaintadd', component: ComplaintAddComponent },
  { path: 'complaintedit/:id', component: ComplaintEditComponent },
  { path: 'complaintdetails/:id', component: ComplaintDetailsComponent },
  { path: 'admin/complaints', component: ComplaintAdminComponent, canActivate: [adminGuard] },
  { path: 'admin/complaint/:id', component: ComplaintAdminopenComponent, canActivate: [adminGuard] },
  { path: 'show-ad', component: AdDetailsComponent, canActivate: [clientGuard]},
  { path: 'ad-details/:id', component: AdDetailsComponent },
  { path: 'leave', component: LeaveslistComponent, canActivate: [clientGuard]},
  { path: 'leaveadd', component: LeaveAddComponent , canActivate: [driverGuard]},
  { path: 'leaveedit/:id', component: LeaveEditComponent},
  { path: 'promo', component: PromotionlistComponent},
  { path: 'adlist', component: AdListComponent, canActivate: [clientGuard]},
  { path: 'complaint', component: ComplaintListComponent, canActivate: [clientGuard]},
  { path: 'editad/:id', component: EditAdComponent , canActivate: [clientGuard]},  // Modified to accept an 'id' parameter
  { path: 'crad', component: CreateAdComponent, canActivate: [clientGuard] },
  // Vehicle Routes
  { path: 'vehicles', component: VehicleListComponent, canActivate: [adminGuard]  },
  { path: 'vehicles/new', component: VehicleFormClientComponent, canActivate: [clientGuard]},
  { path: 'admin/vehicles/new', component: VehicleFormAdminComponent, canActivate: [adminGuard]  },
  { path: 'edit-vehicle/:id', component: VehicleEditComponent, canActivate: [adminGuard]  },
  { path: 'driver/vehicles/new', component: VehicleFormDelivaryComponent , canActivate: [driverGuard]},
  // Delivery Routes
  { path: 'deliveries/assign', component: DeliveryAssignmentComponent, canActivate: [adminGuard]  },
  { path: 'deliveries', component: DeliveryListComponent, canActivate: [adminGuard]  },
  { path: 'deliveries/driver', component: DriverDeliveryComponent, canActivate: [driverGuard] },
  { path: 'deliveries/user', component: UserDeliveryTrackingComponent, canActivate: [clientGuard] },
  { path: 'deliveries/edit/:id', component: DeliveryEditComponent , canActivate: [adminGuard] },
  // FastPost Routes
  { path: 'fastposts/new', component: FastpostFormComponent, canActivate: [clientGuard] },
  { path: 'fastposts', component: FastpostListComponent , canActivate: [adminGuard] },
  { path: 'fastposts/edit/:id', component: FastpostEditComponent, canActivate: [adminGuard]  },

  { path: 'admin', component: AllTemplateBackComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
