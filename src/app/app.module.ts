import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/template/header/header.component';
import { FooterComponent } from './components/template/footer/footer.component';
import { NavComponent } from './components/template/nav/nav.component';
import { ProductCreateComponent } from './components/product/product-create/product-create.component';
import { HttpClientModule } from  '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductReadComponent } from './components/product/product-read/product-read.component';

import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from  '@angular/common';

import { ProductUpdateComponent } from './components/product/product-update/product-update.component';
import { ProductDeleteComponent } from './components/product/product-delete/product-delete.component';
import { HomeComponent } from './view/home/home.component';
import { ProductCrudComponent } from './view/product-crud/product-crud.component';
import { LoginComponent } from './view/login/login.component';
import { AngularMaterialModule } from './angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginLayoutComponent } from './layouts/login-layout.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { EmpresaCrudComponent } from './view/empresa-crud/empresa-crud.component';
import { EmpresaReadComponent } from './components/empresa/empresa-read/empresa-read.component';
import { EmpresaUpdateComponent } from './components/empresa/empresa-update/empresa-update.component';
import { EmpresaCreateComponent } from './components/empresa/empresa-create/empresa-create.component';
import { EmpresaDeleteComponent } from './components/empresa/empresa-delete/empresa-delete.component';
import { EmpresaReadLayoutComponent } from './layouts/empresa-read-layout/empresa-read-layout.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    HomeComponent,
    ProductCrudComponent,
    ProductCreateComponent,
    ProductReadComponent,    
    ProductUpdateComponent,
    ProductDeleteComponent,
    LoginComponent,
    LoginLayoutComponent,
    HomeLayoutComponent,
    EmpresaCrudComponent,
    EmpresaReadComponent,
    EmpresaUpdateComponent,
    EmpresaCreateComponent,
    EmpresaDeleteComponent,
    EmpresaReadLayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,       
    HttpClientModule,
    FormsModule,  
    AngularMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule  
  ],
  providers: [{
    provide: LOCALE_ID,
    useValue: 'pt-BR'
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
