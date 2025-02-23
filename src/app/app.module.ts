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

import { FormsModule } from '@angular/forms';
import { RouterModule, Routes  } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AuthService } from './services/auth.service';
import {NgOptimizedImage} from "@angular/common";

// Import du module généré par OpenAPI (vérifiez le chemin d'accès)
import { ApiModule , Configuration } from './openapi';
import { ProductListComponent } from "./FrontOffice/product-list/product-list.component";
import { ProductCreateComponent } from './FrontOffice/product-create/product-create.component';
import { ProductEditComponent } from './FrontOffice/product-edit/product-edit.component';

import { ReactiveFormsModule } from '@angular/forms';

export function initializeKeycloak(authService: AuthService) {
  return () => authService.init();
}

const apiConfig = new Configuration({
  basePath: 'http://localhost:8089/speedygo',
  credentials: {}  // Si aucune authentification n'est utilisée, un objet vide suffit.
});

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    KeycloakAngularModule, // ✅ Keycloak Integration
    FormsModule,
    RouterModule,
    AllTemplateBackComponent,
    NgOptimizedImage,
    SidebarBackComponent,
    NavbarBackComponent,
    FooterBackComponent,
    ProductListComponent,
    ProductCreateComponent,
    ProductEditComponent,
    HttpClientModule,
    AllTemplateFrontComponent,
    HeaderFrontComponent,
    FooterFrontComponent,
    // Configuration du module API pour pointer vers l'URL racine de votre backend
    ApiModule.forRoot(() => apiConfig)
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
