import { Component, OnInit, ViewChild } from "@angular/core";
import { FuncionarioDTO } from "src/app/models/FuncionarioDTO";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { FuncionarioService } from "src/app/services/Funcionario.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-funcionario-read",
  templateUrl: "./funcionario-read.component.html",
  styleUrls: ["./funcionario-read.component.css"],
})
export class FuncionarioReadComponent implements OnInit {
  private _filtroLista: string;
  funcionarios: FuncionarioDTO[];
  dataSource = new MatTableDataSource<FuncionarioDTO>(this.funcionarios);
  displayedColumns = ["id", "nome", "cpf", "email", 'action'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private funcionarioService: FuncionarioService,
    private router: Router
  ) {}

  get filtrarLista() {
    return this._filtroLista;
  }

  set filtrarLista(value: string) {
    this._filtroLista = value;
    this.dataSource.data = this._filtroLista
      ? this.filtrarFuncionarios(this.filtrarLista)
      : this.funcionarios;
  }

  ngOnInit(): void {
    this.getAllFuncionarios();
  }

  filtrarFuncionarios(value: string): FuncionarioDTO[] {
    value = value.toLocaleLowerCase();
    return this.funcionarios.filter(
      (funcionarios) =>
        funcionarios.nome.toLocaleLowerCase().indexOf(value) !== -1
    );
  }

  getAllFuncionarios(): void {
    this.funcionarioService
      .getAllInfoFuncionario()
      .subscribe(
        (funcionarios: FuncionarioDTO[]) => {
          this.funcionarios = funcionarios;
          this.dataSource.data = funcionarios;
          console.log(this.funcionarios);
      });
  }

  navigateToCreate() {
    this.router.navigate(['/funcionarios/create']);
  }
}
