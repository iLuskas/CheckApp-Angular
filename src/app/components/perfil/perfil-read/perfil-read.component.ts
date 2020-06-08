import { Component, OnInit, ViewChild } from '@angular/core';
import { PerfilService } from 'src/app/services/Perfil.service';
import { PerfilDTO } from 'src/app/models/PerfilDTO';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import * as XLSX from "xlsx";
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-perfil-read',
  templateUrl: './perfil-read.component.html',
  styleUrls: ['./perfil-read.component.css']
})
export class PerfilReadComponent implements OnInit {
  private _filtroLista: string;
  perfils: PerfilDTO[];
  dataSource = new MatTableDataSource<PerfilDTO>(this.perfils);
  displayedColumns = ['id', 'funcao_perfil'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private perfilService: PerfilService,
    private datePipe: DatePipe) { }

  get filtrarLista() {
    return this._filtroLista;
  }

  set filtrarLista(value: string) {
    this._filtroLista = value;
    this.dataSource.data = this._filtroLista ? this.filtrarPerfils(this.filtrarLista) : this.perfils;
  }

  ngOnInit(): void {
    this.getAllPerfils();
    this.dataSource.paginator = this.paginator;
  }

  filtrarPerfils(value: string) : PerfilDTO[] {
    value = value.toLocaleLowerCase();
    return this.perfils.filter(
      perfils => perfils.funcao_perfil.toLocaleLowerCase().indexOf(value) !== -1
    );
  }

  getAllPerfils() 
  {
    this.perfilService.getAllPerfil().subscribe(
      (perfils: PerfilDTO[]) => {
        this.perfils = perfils;
        this.dataSource.data = perfils;
        console.log(this.perfils);
      }
    );
  }

  ExportExcel() {
    let element = document.getElementById("table-perfil");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "PERFIL");

    XLSX.writeFile(
      wb,
      `CHKAPP_PERFIL${this.transformDate(new Date())}.xlsx`
    );
  }

  transformDate(date): string {
    return this.datePipe.transform(date, "yyyyMMddHHmm");
  }
}
