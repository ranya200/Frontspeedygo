import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import {AllTemplateFrontComponent} from "./FrontOffice/all-template-front/all-template-front.component";
import {AllTemplateBackComponent} from "./BackOffice/all-template-back/all-template-back.component";
import { CreateAdComponent } from './FrontOffice/Ad/create-ad/create-ad.component';
import { AdListComponent } from './FrontOffice/Ad/ad-list/ad-list.component';
import { EditAdComponent } from './FrontOffice/Ad/ad-edit/ad-edit.component';
import { ComplaintComponent } from './FrontOffice/complaint/complaint.component';

const routes: Routes = [
  { path: '', component: AllTemplateFrontComponent },
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
