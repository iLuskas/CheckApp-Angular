import { Injectable } from '@angular/core';
import { InspecaoDTO } from '../models/InspecaoDTO';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, EMPTY } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InspecaoService {
 //baseURL = "https://localhost:44363/api/Inspecao";
 baseURL = "https://www.safetyplan.net.br/checkapp/api/Inspecao";
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
  this.showMessage("Ocorreu um erro!", true);
  return EMPTY;
}

getAllInspecao(token: string = null): Observable<InspecaoDTO[]> {

  return this.http.get<InspecaoDTO[]>(this.baseURL).pipe(
    map((obj) => obj),
    catchError((e) => this.erroHandler(e))
  );
}

getInspecaoById(id: string, token: string = null): Observable<InspecaoDTO> {

  return this.http.get<InspecaoDTO[]>(`${this.baseURL}/${id}`).pipe(
    map((obj) => obj),
    catchError((e) => this.erroHandler(e))
  );
}

GetInspecaoByEquipIdAndAgeId(equipId: string, ageId: string, token: string = null): Observable<InspecaoDTO> {

  return this.http.get<InspecaoDTO>(`${this.baseURL}/GetInspecaoByEquipIdAndAgeId?equipamentoId=${equipId}&agendamentoId=${ageId}`).pipe(
    map((obj) => obj),
    catchError((e) => this.erroHandler(e))
  );
}

postInspecao(inspecao: InspecaoDTO, token: string = null) {
  const options: Object = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
    responseType: "text",
  };

  return this.http.post(this.baseURL, inspecao, options).pipe(
    map((obj) => obj),
    catchError((e) => this.erroHandler(e))
  );
}

putInspecao(inspecao: InspecaoDTO, token: string = null) {
  const options: Object = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
    responseType: "text",
  };

  return this.http.put(this.baseURL, inspecao, options).pipe(
    map((obj) => obj),
    catchError((e) => this.erroHandler(e))
  );
}

deleteInspecao(inspecao: InspecaoDTO, token: string = null) {
  const options: Object = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    // body: {
    //       id: perfil.id,
    //       pais: perfil.funcao_perfil
    //    },
    responseType: 'text'
  };

  return this.http.delete(this.baseURL, options).pipe(
    map((obj) => obj),
    catchError((e) => this.erroHandler(e))
  );
}
}
