import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import {AllTemplateFrontComponent} from "./FrontOffice/all-template-front/all-template-front.component";
import {AllTemplateBackComponent} from "./BackOffice/all-template-back/all-template-back.component";
import { CreateAdComponent } from './FrontOffice/Ad/create-ad/create-ad.component';
import { AdListComponent } from './FrontOffice/Ad/ad-list/ad-list.component';
import { EditAdComponent } from './FrontOffice/Ad/ad-edit/ad-edit.component';
import { ComplaintComponent } from './FrontOffice/complaint/complaint.component';


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
  { path: 'leaveadmin', component: LeaveadminComponent },
  { path: 'promo', component: PromotionlistComponent },
  { path: 'promoadd', component: PromotionaddComponent },
  { path: 'promoedit/:id', component: PromotioneditComponent },
  { path: 'adlist', component: AdListComponent },
  { path: 'complaint', component: ComplaintComponent },
  { path: 'editad/:id', component: EditAdComponent },  // Modified to accept an 'id' parameter
  { path: 'crad', component: CreateAdComponent },

  { path: 'admin', component: AllTemplateBackComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
