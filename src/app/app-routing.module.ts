import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from './view/home/home.component';
import { LoginComponent } from './view/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout.component';
import { EmpresaCrudComponent } from './view/empresa-crud/empresa-crud.component';
import { PerfilCrudComponent } from './view/perfil-crud/perfil-crud.component';
import { FuncionarioCrudComponent } from './view/funcionario-crud/funcionario-crud.component';
import { UsuarioCrudComponent } from './view/usuario-crud/usuario-crud.component';
import { EquipamentoCrudComponent } from './view/equipamento-crud/equipamento-crud.component';
import { RelatorioComponent } from './view/relatorio/relatorio.component';
import { EmpresaReadComponent } from './components/empresa/empresa-read/empresa-read.component';
import { EquipamentoReadComponent } from './components/equipamento/equipamento-read/equipamento-read.component';
import { RecuperarSenhaComponent } from './view/recuperar-senha/recuperar-senha.component';
import { AgendamentoComponent } from './components/agendamento/agendamento.component';
import { PerfilFuncionarioComponent } from './components/funcionario/perfil-funcionario/perfil-funcionario.component';
import { InspecaoComponent } from './components/inspecao/inspecao.component';
import { ManutencaoComponent } from './components/manutencao/manutencao.component';
import { InspecaoDetalheComponent } from './components/inspecao/inspecao-detalhe/inspecao-detalhe.component';


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
        path: "agendamentos",
        component: AgendamentoComponent
      }, 
      {
        path: "empresas",
        component: EmpresaCrudComponent
      },      
      {
        path: "perfil",
        component: PerfilCrudComponent
      },
      {
        path: "funcionarios",
        component: FuncionarioCrudComponent
      },
      {
        path: "usuarios",
        component: UsuarioCrudComponent
      },
      {
        path: "equipamentos",
        component: EquipamentoCrudComponent
      },
      {
        path: "relatorios",
        component: RelatorioComponent,
      },
      {
        path: "inspecoes",
        component: InspecaoComponent,
      },
      {
        path: "detalhe-inspecao",
        component: InspecaoDetalheComponent,
      },
      {
        path: "manutencoes",
        component: ManutencaoComponent,
      },
      {
        path: "perfilFuncionario",
        component: PerfilFuncionarioComponent,
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
      },
      {
        path: 'recuperarSenha',
        component: RecuperarSenhaComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
