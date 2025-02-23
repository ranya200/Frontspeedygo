import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import {AllTemplateFrontComponent} from "./FrontOffice/all-template-front/all-template-front.component";
import {AllTemplateBackComponent} from "./BackOffice/all-template-back/all-template-back.component";
import {ProductListComponent} from "./FrontOffice/product-list/product-list.component";
import { ProductCreateComponent } from './FrontOffice/product-create/product-create.component';
import { ProductEditComponent } from './FrontOffice/product-edit/product-edit.component';

const routes: Routes = [
  { path: '', component: AllTemplateFrontComponent },
  { path: 'product', component: ProductListComponent },
  { path: 'create-product', component: ProductCreateComponent },
  { path: 'edit-product/:id', component: ProductEditComponent },
  { path: 'admin', component: AllTemplateBackComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
