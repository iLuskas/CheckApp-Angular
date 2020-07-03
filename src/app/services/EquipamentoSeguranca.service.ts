import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, EMPTY } from 'rxjs';
import { EquipamentoSegurancaDTO } from '../models/EquipamentoSeguranca';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EquipamentoSegurancaService {
  baseURL = "https://www.safetyplan.net.br/checkapp/api/Equipamento_Seguranca";
  //baseURL = "https://localhost:44363/api/Equipamento_Seguranca";
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, "X", {
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: isError ? ["msg-error"] : ["msg-success"],
    });
  }

  erroHandler(e: any): Observable<any> {
    this.showMessage('Ocorreu um erro!', true);
    return EMPTY;
  }

  getAllEquipamento(token: string = null): Observable<EquipamentoSegurancaDTO[]> {
    // const options = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + token
    //   })
    // };

    return this.http.get<EquipamentoSegurancaDTO[]>(`${this.baseURL}/getAllEquipamento`).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  getEquipamentoById(
    id: string,
    token: string = null
  ): Observable<EquipamentoSegurancaDTO> {
    // const options = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + token
    //   })
    // };

    return this.http
      .get<EquipamentoSegurancaDTO>(
        `${this.baseURL}/getEquipamentoById/${id}`
      )
      .pipe(
        map((obj) => obj),
        catchError((e) => this.erroHandler(e))
      );
  }

  getAllEquipamentoByEmpresaId(
    id: string,
    token: string = null
  ): Observable<EquipamentoSegurancaDTO[]> {
    // const options = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + token
    //   })
    // };

    return this.http
      .get<EquipamentoSegurancaDTO[]>(`${this.baseURL}/getAllEquipamentoByEmpresaId/${id}`)
      .pipe(
        map((obj) => obj),
        catchError((e) => this.erroHandler(e))
      );
  }

  getAllEquipamentoByEmpresaIdAndTipo(
    id: string,
    tipoId: string,
    token: string = null
  ): Observable<EquipamentoSegurancaDTO[]> {
    // const options = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + token
    //   })
    // };

    return this.http
      .get<EquipamentoSegurancaDTO>(
        `${this.baseURL}/getAllEquipamentoByEmpresaIdAndTipo/?id=${id}&tipoId=${tipoId}`
      )
      .pipe(
        map((obj) => obj),
        catchError((e) => this.erroHandler(e))
      );
  }

  getEquipByNumExtintor(
    numExtintor: string,
    token: string = null
  ): Observable<any> {
    // const options = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + token
    //   })
    // };

    return this.http
      .get<any>(
        `${this.baseURL}/getEquipByNumExtintor/?numExtintor=${numExtintor}`
      )
      .pipe(
        map((obj) => obj),
        catchError((e) => this.erroHandler(e))
      );
  }

  postEquipamento(
    equipamentoSegurancaDTO: EquipamentoSegurancaDTO,
    token: string = null
  ) {
    const options: Object = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'text'
    };

    return this.http.post(this.baseURL, equipamentoSegurancaDTO, options).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  putEquipamento(
    equipamentoSegurancaDTO: EquipamentoSegurancaDTO,
    token: string = null
  ): Observable<any> {
    const options: Object = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'text'
    };

    return this.http.put(this.baseURL, equipamentoSegurancaDTO, options).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  deleteEquipamento(
    equipamentoSegurancaDTO: EquipamentoSegurancaDTO,
    token: string = null
  ): Observable<any> {
    const options: Object = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        id: equipamentoSegurancaDTO.id,
        empresaClienteId: equipamentoSegurancaDTO.empresaClienteId,
        tipo_equipamentoId: equipamentoSegurancaDTO.tipo_equipamentoId,
        localizacao_equipamento: equipamentoSegurancaDTO.localizacao_equipamento,
        qrCode: equipamentoSegurancaDTO.qrCode,
        qrcode_data_geracao: equipamentoSegurancaDTO.qrcode_data_geracao,
        dataCriacao_equipamento: equipamentoSegurancaDTO.dataCriacao_equipamento,
        extintorDTO: equipamentoSegurancaDTO.extintorDTO
      },
      responseType: 'text'
    };

    console.log(JSON.stringify(options));
    return this.http.delete(this.baseURL, options).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }
}
