import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import {AllTemplateFrontComponent} from "./FrontOffice/all-template-front/all-template-front.component";
import {AllTemplateBackComponent} from "./BackOffice/all-template-back/all-template-back.component";
import { LeaveComponent } from './FrontOffice/leave/leave.component';
import { PromotionComponent } from './FrontOffice/promotion/promotion.component';

const routes: Routes = [
  { path: '', component: AllTemplateFrontComponent },
  { path: 'leave', component: LeaveComponent },
  { path: 'promo', component: PromotionComponent },
  { path: 'admin', component: AllTemplateBackComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
