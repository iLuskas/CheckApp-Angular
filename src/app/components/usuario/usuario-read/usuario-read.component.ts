import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from 'src/app/models/Usuario';
import { MatPaginator } from '@angular/material/paginator';
import { UsuarioService } from 'src/app/services/Usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario-read',
  templateUrl: './usuario-read.component.html',
  styleUrls: ['./usuario-read.component.css']
})
export class UsuarioReadComponent implements OnInit {
  private _filtroLista: string;
  usuarios: Usuario[];
  dataSource = new MatTableDataSource<Usuario>(this.usuarios);
  displayedColumns = ['id', 'login', 'action'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  get filtrarLista() {
    return this._filtroLista;
  }

  set filtrarLista(value: string) {
    this._filtroLista = value;
    this.dataSource.data = this._filtroLista ? this.filtrarUsuarios(this._filtroLista) : this.usuarios;
  }

  ngOnInit(): void {
    this.getAllUsuarios();
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
        console.log(this.usuarios);
      }
    );
  }

  navigateToCreate() {
    this.router.navigate(['/usuarios/create']);
  }

}
