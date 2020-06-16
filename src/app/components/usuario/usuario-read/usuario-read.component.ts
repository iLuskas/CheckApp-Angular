import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from 'src/app/models/Usuario';
import { MatPaginator } from '@angular/material/paginator';
import { UsuarioService } from 'src/app/services/Usuario.service';
import * as XLSX from "xlsx";
import { DatePipe } from '@angular/common';
import { UsuarioHelper } from 'src/app/models/modelsHelper/UsuarioHelper';
import { FuncionarioService } from 'src/app/services/Funcionario.service';
import { FuncionarioDTO } from 'src/app/models/FuncionarioDTO';
@Component({
  selector: 'app-usuario-read',
  templateUrl: './usuario-read.component.html',
  styleUrls: ['./usuario-read.component.css']
})
export class UsuarioReadComponent implements OnInit, AfterViewInit {
  private _filtroLista: string;
  usuarios: Usuario[];
  usuarioHelper: UsuarioHelper[];
  funcionarios: FuncionarioDTO[];
  dataSource = new MatTableDataSource<Usuario>(this.usuarios);
  dataSourceUsuarioHelper = new MatTableDataSource<UsuarioHelper>(this.usuarioHelper);
  displayedColumns = ['id', 'login'];
  displayedColumnsFuncUser = ['id', 'login', 'nomeFuncionario'];
  IncluirFuncionario: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private usuarioService: UsuarioService,
    private datePipe: DatePipe,
    private funcionarioService: FuncionarioService
  ) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  get filtrarLista() {
    return this._filtroLista;
  }

  set filtrarLista(value: string) {
    this._filtroLista = value;
    this.dataSource.data = this._filtroLista ? this.filtrarUsuarios(this._filtroLista) : this.usuarios;
  }

  ngOnInit(): void {
    this.getAllUsuarios();
    this.getAllFuncionarios();
  }

  filtrarUsuarios(value: string) : Usuario[] {
    value = value.toLocaleLowerCase();
    return this.usuarios.filter(
      usuarios => usuarios.login.toLocaleLowerCase().indexOf(value) !== -1
    );
  }

  getAllUsuarios() 
  {
    this.usuarioService.getAllUsuario().subscribe(
      (usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.dataSource.data = usuarios;
      }
    );
  }

  getAllFuncionarios(): void {
    this.funcionarioService
      .getAllInfoFuncionario()
      .subscribe((funcionarios: FuncionarioDTO[]) => {
        this.funcionarios = funcionarios;
        this.incluirFuncionario(this.usuarios);
      });
  }

  getFuncionario(id: number): string {
    const funcionario = this.funcionarios.find( funcionario => funcionario.usuarioId === id) ;
    return funcionario ? funcionario.nome : "Usuário sem funcionário anexado!";
  }

  incluirFuncionario(usuarios: Usuario[]) {
    this.usuarioHelper = [];
    usuarios.forEach((usuario) =>
    {
      this.usuarioHelper.push(
        {
          id: usuario.id,
          login: usuario.login,
          nomeFuncionario: this.getFuncionario(usuario.id)
        }
      );
    });
    this.dataSourceUsuarioHelper.data = this.usuarioHelper;
  }

  ExportExcel() {
    let element = document.getElementById("table-usuario");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "USUÁRIOS");

    XLSX.writeFile(
      wb,
      `CHKAPP_USUARIOS${this.transformDate(new Date())}.xlsx`
    );
  }

  transformDate(date): string {
    return this.datePipe.transform(date, "yyyyMMddHHmm");
  }
}
