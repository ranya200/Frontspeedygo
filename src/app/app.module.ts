import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AllTemplateBackComponent } from './BackOffice/all-template-back/all-template-back.component';
import { FooterBackComponent } from './BackOffice/footer-back/footer-back.component';
import { NavbarBackComponent } from './BackOffice/navbar-back/navbar-back.component';
import { AllTemplateFrontComponent } from './FrontOffice/all-template-front/all-template-front.component';
import { FooterFrontComponent } from './FrontOffice/footer-front/footer-front.component';
import { HeaderFrontComponent } from './FrontOffice/header-front/header-front.component';
import { SidebarBackComponent} from "./BackOffice/sidebar-back/sidebar-back.component";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AuthService } from './services/auth.service';
import {NgOptimizedImage} from "@angular/common";
import { CreateAdComponent } from './FrontOffice/Ad/create-ad/create-ad.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AdListComponent } from './FrontOffice/Ad/ad-list/ad-list.component';
import { EditAdComponent } from './FrontOffice/Ad/ad-edit/ad-edit.component';
import { ComplaintComponent } from './FrontOffice/complaint/complaint.component';


export function initializeKeycloak(authService: AuthService) {
  return () => authService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    
   

   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KeycloakAngularModule, // ✅ Keycloak Integration
    FormsModule,
    RouterModule,
    AllTemplateBackComponent,
    NgOptimizedImage,
    SidebarBackComponent,
    NavbarBackComponent,
    FooterBackComponent,
    CreateAdComponent,
    ReactiveFormsModule,
    HttpClientModule,
    AdListComponent,
    EditAdComponent,
    ComplaintComponent,
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
