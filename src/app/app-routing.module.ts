import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from './view/home/home.component';
import { LoginComponent } from './view/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout.component';
import { EmpresaCrudComponent } from './view/empresa-crud/empresa-crud.component';
import { EmpresaUpdateComponent } from './components/empresa/empresa-update/empresa-update.component';
import { EmpresaCreateComponent } from './components/empresa/empresa-create/empresa-create.component';
import { EmpresaDeleteComponent } from './components/empresa/empresa-delete/empresa-delete.component';
import { EmpresaReadLayoutComponent } from './layouts/empresa-read-layout/empresa-read-layout.component';
import { PerfilCrudComponent } from './view/perfil-crud/perfil-crud.component';
import { PerfilCreateComponent } from './components/perfil/perfil-create/perfil-create.component';
import { PerfilReadComponent } from './components/perfil/perfil-read/perfil-read.component';
import { PerfilUpdateComponent } from './components/perfil/perfil-update/perfil-update.component';
import { PerfilDeleteComponent } from './components/perfil/perfil-delete/perfil-delete.component';
import { PerfilReadLayoutComponent } from './layouts/perfil-read-layout/perfil-read-layout.component';
import { FuncionarioCrudComponent } from './view/funcionario-crud/funcionario-crud.component';
import { FuncionarioCreateComponent } from './components/funcionario/funcionario-create/funcionario-create.component';
import { FuncionarioUpdateComponent } from './components/funcionario/funcionario-update/funcionario-update.component';
import { FuncionarioDeleteComponent } from './components/funcionario/funcionario-delete/funcionario-delete.component';
import { FuncionarioReadLayoutComponent } from './layouts/funcionario-read-layout/funcionario-read-layout.component';
import { UsuarioCrudComponent } from './view/usuario-crud/usuario-crud.component';
import { UsuarioCreateComponent } from './components/usuario/usuario-create/usuario-create.component';
import { UsuarioReadLayoutComponent } from './layouts/usuario-read-layout/usuario-read-layout.component';
import { UsuarioUpdateComponent } from './components/usuario/usuario-update/usuario-update.component';
import { UsuarioDeleteComponent } from './components/usuario/usuario-delete/usuario-delete.component';


const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    canActivate: [AuthGuard],
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
      {
        path: "perfils",
        component: PerfilCrudComponent
      },
      {
        path: "perfils/create",
        component: PerfilCreateComponent
      },
      {
        path: "perfils/read/:id",
        component: PerfilReadLayoutComponent
      },
      {
        path: "perfils/update/:id",
        component: PerfilUpdateComponent
      },
      {
        path: "perfils/delete/:id",
        component: PerfilDeleteComponent
      },
      {
        path: "funcionarios",
        component: FuncionarioCrudComponent
      },
      {
        path: "funcionarios/create",
        component: FuncionarioCreateComponent
      },
      {
        path: "funcionarios/read/:id",
        component: FuncionarioReadLayoutComponent
      },
      {
        path: "funcionarios/update/:id",
        component: FuncionarioUpdateComponent
      },
      {
        path: "funcionarios/delete/:id",
        component: FuncionarioDeleteComponent
      },
      {
        path: "usuarios",
        component: UsuarioCrudComponent
      },
      {
        path: "usuarios/create",
        component: UsuarioCreateComponent
      },
      {
        path: "usuarios/read/:id",
        component: UsuarioReadLayoutComponent
      },
      {
        path: "usuarios/update/:id",
        component: UsuarioUpdateComponent
      },
      {
        path: "usuarios/delete/:id",
        component: UsuarioDeleteComponent
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
