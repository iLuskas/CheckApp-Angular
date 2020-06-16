import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/template/header/header.component';
import { FooterComponent } from './components/template/footer/footer.component';
import { NavComponent } from './components/template/nav/nav.component';
import { HttpClientModule } from  '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import localePt from '@angular/common/locales/pt';
import { registerLocaleData, DatePipe } from  '@angular/common';

import { HomeComponent } from './view/home/home.component';
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
import { PerfilCrudComponent } from './view/perfil-crud/perfil-crud.component';
import { PerfilReadComponent } from './components/perfil/perfil-read/perfil-read.component';
import { PerfilCreateComponent } from './components/perfil/perfil-create/perfil-create.component';
import { PerfilUpdateComponent } from './components/perfil/perfil-update/perfil-update.component';
import { PerfilDeleteComponent } from './components/perfil/perfil-delete/perfil-delete.component';
import { FuncionarioCrudComponent } from './view/funcionario-crud/funcionario-crud.component';
import { FuncionarioReadComponent } from './components/funcionario/funcionario-read/funcionario-read.component';
import { FuncionarioCreateComponent } from './components/funcionario/funcionario-create/funcionario-create.component';
import { FuncionarioUpdateComponent } from './components/funcionario/funcionario-update/funcionario-update.component';
import { FuncionarioDeleteComponent } from './components/funcionario/funcionario-delete/funcionario-delete.component';
import { PerfilReadLayoutComponent } from './layouts/perfil-read-layout/perfil-read-layout.component';
import { FuncionarioReadLayoutComponent } from './layouts/funcionario-read-layout/funcionario-read-layout.component';
import { UsuarioCrudComponent } from './view/usuario-crud/usuario-crud.component';
import { UsuarioReadComponent } from './components/usuario/usuario-read/usuario-read.component';
import { UsuarioCreateComponent } from './components/usuario/usuario-create/usuario-create.component';
import { UsuarioUpdateComponent } from './components/usuario/usuario-update/usuario-update.component';
import { UsuarioDeleteComponent } from './components/usuario/usuario-delete/usuario-delete.component';
import { UsuarioReadLayoutComponent } from './layouts/usuario-read-layout/usuario-read-layout.component';
import { EquipamentoCrudComponent } from './view/equipamento-crud/equipamento-crud.component';
import { EquipamentoCreateComponent } from './components/equipamento/equipamento-create/equipamento-create.component';
import { QRCodeModule } from 'angularx-qrcode';
import { RelatorioComponent } from './view/relatorio/relatorio.component';
import { EquipamentoReadComponent } from './components/equipamento/equipamento-read/equipamento-read.component';
import { RecuperarSenhaComponent } from './view/recuperar-senha/recuperar-senha.component';
import { AgendamentoComponent } from './components/agendamento/agendamento.component';
registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    HomeComponent,
    LoginComponent,
    LoginLayoutComponent,
    HomeLayoutComponent,
    EmpresaCrudComponent,
    EmpresaReadComponent,
    EmpresaUpdateComponent,
    EmpresaCreateComponent,
    EmpresaDeleteComponent,
    EmpresaReadLayoutComponent,
    PerfilCrudComponent,
    PerfilReadComponent,
    PerfilCreateComponent,
    PerfilUpdateComponent,
    PerfilDeleteComponent,
    FuncionarioCrudComponent,
    FuncionarioReadComponent,
    FuncionarioCreateComponent,
    FuncionarioUpdateComponent,
    FuncionarioDeleteComponent,
    PerfilReadLayoutComponent,
    FuncionarioReadLayoutComponent,
    UsuarioCrudComponent,
    UsuarioReadComponent,
    UsuarioCreateComponent,
    UsuarioUpdateComponent,
    UsuarioDeleteComponent,
    UsuarioReadLayoutComponent,
    EquipamentoCrudComponent,
    EquipamentoCreateComponent,
    RelatorioComponent,
    EquipamentoReadComponent,
    RecuperarSenhaComponent,
    AgendamentoComponent,
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
    QRCodeModule 
  ],
  providers: [{
    provide: LOCALE_ID,
    useValue: 'pt-BR'
  }, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
