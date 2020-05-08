import { ProductDeleteComponent } from './components/product/product-delete/product-delete.component';
import { ProductUpdateComponent } from './components/product/product-update/product-update.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ProductCreateComponent } from './components/product/product-create/product-create.component';
import { HomeComponent } from './view/home/home.component';
import { ProductCrudComponent } from './view/product-crud/product-crud.component';
import { LoginComponent } from './view/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout.component';
import { EmpresaCrudComponent } from './view/empresa-crud/empresa-crud.component';
import { EmpresaUpdateComponent } from './components/empresa/empresa-update/empresa-update.component';
import { EmpresaCreateComponent } from './components/empresa/empresa-create/empresa-create.component';
import { EmpresaDeleteComponent } from './components/empresa/empresa-delete/empresa-delete.component';
import { EmpresaReadLayoutComponent } from './layouts/empresa-read-layout/empresa-read-layout.component';


const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
   // canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: "empresas",
        component: EmpresaCrudComponent
      },
      {
        path: "empresas/create",
        component: EmpresaCreateComponent
      },
      {
        path: "empresas/read/:id",
        component: EmpresaReadLayoutComponent
      },
      {
        path: "empresas/update/:id",
        component: EmpresaUpdateComponent
      },
      {
        path: "empresas/delete/:id",
        component: EmpresaDeleteComponent
      },
    ]
  },
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
