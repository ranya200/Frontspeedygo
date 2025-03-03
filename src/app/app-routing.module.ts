import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import {AllTemplateFrontComponent} from "./FrontOffice/all-template-front/all-template-front.component";
import {AllTemplateBackComponent} from "./BackOffice/all-template-back/all-template-back.component";
import { CreateAdComponent } from './FrontOffice/Ad/create-ad/create-ad.component';
import { AdListComponent } from './FrontOffice/Ad/ad-list/ad-list.component';
import { EditAdComponent } from './FrontOffice/Ad/ad-edit/ad-edit.component';


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
import { ComplaintListComponent } from './FrontOffice/complaint/complaint-list/complaint-list.component';
import { ComplaintAddComponent } from './FrontOffice/complaint/complaint-add/complaint-add.component';
import { ComplaintEditComponent } from './FrontOffice/complaint/complaint-edit/complaint-edit.component';
import { ComplaintDetailsComponent } from './FrontOffice/complaint/complaint-details/complaint-details.component';
import { ComplaintAdminComponent } from './BackOffice/complaint/complaint-admin/complaint-admin.component';
import { ComplaintAdminopenComponent } from './BackOffice/complaint/complaint-adminopen/complaint-adminopen.component';
import { AdDetailsComponent } from './FrontOffice/Ad/ad-details/ad-details.component';

const routes: Routes = [
  { path: '', component: AllTemplateFrontComponent },
  { path: 'product', component: ProductListComponent },
  { path: 'create-product', component: ProductCreateComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  { path: 'edit-product/:id', component: ProductEditComponent },
  { path: 'create-order', component: OrderCreateComponent },
  { path: 'payment' , component: PaymentFormComponent },
  { path: 'carpooling', component: CarpoolingComponent },
  { path: 'company', component: CompanyComponent },
  { path: 'leave', component: LeaveslistComponent },
  { path: 'leaveadd', component: LeaveAddComponent },
  { path: 'leaveedit/:id', component: LeaveEditComponent },
  { path: 'promo', component: PromotionComponent },
  { path: 'complaint', component: ComplaintListComponent },
  { path: 'complaintadd', component: ComplaintAddComponent },
  { path: 'complaintedit/:id', component: ComplaintEditComponent },
  { path: 'complaintdetails/:id', component: ComplaintDetailsComponent },
  { path: 'admin/complaints', component: ComplaintAdminComponent },
  { path: 'admin/complaint/:id', component: ComplaintAdminopenComponent },
  { path: 'editad/:id', component: EditAdComponent },  // Modified to accept an 'id' parameter
  { path: 'crad', component: CreateAdComponent },
  { path: 'adlist', component: AdListComponent },
  { path: 'show-ad', component: AdDetailsComponent},
  { path: 'ad-details/:id', component: AdDetailsComponent },

  { path: 'admin', component: AllTemplateBackComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
