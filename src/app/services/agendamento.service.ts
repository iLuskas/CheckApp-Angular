import { Injectable } from "@angular/core";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, EMPTY } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { AgendaInspManutDTO } from '../models/AgendaInspManutDTO';
import { TipoAgendamentoDTO } from '../models/TipoAgendamentoDTO';
import { StatusAgendaDTO } from '../models/StatusAgendaDTO';
import { ModeloAgendaInspManut } from '../models/modelsHelper/ModeloAgendaInspManut';


@Injectable({
  providedIn: "root",
})
export class AgendamentoService {
   //baseURL = "https://localhost:44363/api/Agendamento";
  baseURL = "https://www.safetyplan.net.br/checkapp/api/Agendamento";
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, "x", {
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: isError ? ["msg-error"] : ["msg-success"],
    });
  }

  erroHandler(e: any): Observable<any> {
    console.log(e);
    let mensagem = 'Ocorreu um erro!';
    if(e.status === 401){
      mensagem = "Sessão expirada!"
    }

    this.showMessage(mensagem, true);
    return EMPTY;
  }

  getAllAgendamento(token: string = null): Observable<AgendaInspManutDTO[]> {
    return this.http.get<AgendaInspManutDTO[]>(`${this.baseURL}/getAllAgendamento`).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  getAgendamentoById(id: string, token: string = null): Observable<AgendaInspManutDTO> {
    return this.http.get<AgendaInspManutDTO[]>(`${this.baseURL}/getAgendamentoById/${id}`).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  getAllAgendamentoByDt(dataIni: string, dataFim: string, token: string = null): Observable<AgendaInspManutDTO[]> {
    return this.http.get<AgendaInspManutDTO[]>(`${this.baseURL}/getAllAgendamentoByDt?dataIni=${dataIni}&dataFim=${dataFim}`).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  getAllEquipInspByDtAgendamento(dataIni: string, dataFim: string, token: string = null): Observable<any[]> {
    return this.http.get<string[]>(`${this.baseURL}/getAllEquipInspByDtAgendamento?dataIni=${dataIni}&dataFim=${dataFim}`).pipe(
      map((obj) => obj)
    );
  }

  getAllEquipNotInspByDtAgendamento(dataIni: string, dataFim: string, token: string = null): Observable<any[]> {
    return this.http.get<string[]>(`${this.baseURL}/getAllEquipNotInspByDtAgendamento?dataIni=${dataIni}&dataFim=${dataFim}`).pipe(
      map((obj) => obj)
    );
  }

  getAllQtdEquipInspByDtAgendamento(dataIni: string, dataFim: string, token: string = null): Observable<any[]> {
    return this.http.get<string[]>(`${this.baseURL}/getAllQtdEquipInspByDtAgendamento?dataIni=${dataIni}&dataFim=${dataFim}`).pipe(
      map((obj) => obj)
    );
  }

  getAllQtdEquipNotInspByDtAgendamento(dataIni: string, dataFim: string, token: string = null): Observable<any[]> {
    return this.http.get<string[]>(`${this.baseURL}/getAllQtdEquipNotInspByDtAgendamento?dataIni=${dataIni}&dataFim=${dataFim}`).pipe(
      map((obj) => obj)
    );
  }

  postAgendamento(agendamento: ModeloAgendaInspManut, token: string = null) {
    const options: Object = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      responseType: "text",
    };

    return this.http.post(this.baseURL, agendamento, options).pipe(
      map((obj) => obj)
    );
  }

  putAgendamento(agendamento: ModeloAgendaInspManut, token: string = null) {
    const options: Object = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      responseType: "text",
    };

    return this.http.put(this.baseURL, agendamento, options).pipe(
      map((obj) => obj)
    );
  }

  deleteAgendamento(agendamento: ModeloAgendaInspManut, token: string = null) {
    const options: Object = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      body: {
        id: agendamento.id,
        funcionarioId: agendamento.funcionarioId,
        empresaClienteId: agendamento.empresaClienteId,
        tipoEquipamentoId: agendamento.tipoEquipamentoId,
        tipoAgendamentoId: agendamento.tipoAgendamentoId,
        dataInicial: agendamento.dataInicial,
        statusInspManutId: agendamento.statusInspManutId
      },
      responseType: "text",
    };

    return this.http.delete(this.baseURL, options).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  getAllStatus(token: string = null): Observable<StatusAgendaDTO[]> {
    return this.http.get<StatusAgendaDTO[]>(`${this.baseURL}/getAllStatus`).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  getStatusById(id: string, token: string = null): Observable<StatusAgendaDTO> {
    return this.http.get<StatusAgendaDTO[]>(`${this.baseURL}/getStatusById/${id}`).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  getAllTipoAgenda(token: string = null): Observable<TipoAgendamentoDTO[]> {
    return this.http.get<TipoAgendamentoDTO[]>(`${this.baseURL}/getAllTipoAgenda`).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  getTipoAgendaById(id: string, token: string = null): Observable<TipoAgendamentoDTO> {
    return this.http.get<TipoAgendamentoDTO[]>(`${this.baseURL}/getTipoAgendaById/${id}`).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

}
