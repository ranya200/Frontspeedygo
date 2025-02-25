import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import {AllTemplateFrontComponent} from "./FrontOffice/all-template-front/all-template-front.component";
import {AllTemplateBackComponent} from "./BackOffice/all-template-back/all-template-back.component";
import { CarpoolingComponent } from './FrontOffice/carpooling/carpooling.component';
import { CompanyComponent } from './BackOffice/company/company.component';


const routes: Routes = [
  { path: '', component: AllTemplateFrontComponent },
  { path: 'carpooling', component: CarpoolingComponent },
  { path: 'company', component: CompanyComponent },
  { path: 'admin', component: AllTemplateBackComponent, canActivate: [authGuard] },
  
  { path: '**', redirectTo: '' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
