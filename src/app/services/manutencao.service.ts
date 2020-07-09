import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ManutencaoDTO } from '../models/ManutencaoDTO';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, EMPTY } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ManutencaoService {
//baseURL = "https://localhost:44363/api/Manutencao";
baseURL = "https://www.safetyplan.net.br/checkapp/api/Manutencao";
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

getAllManutencao(token: string = null): Observable<ManutencaoDTO[]> {

  return this.http.get<ManutencaoDTO[]>(this.baseURL).pipe(
    map((obj) => obj),
    catchError((e) => this.erroHandler(e))
  );
}

getManutencaoById(id: string, token: string = null): Observable<ManutencaoDTO> {

  return this.http.get<ManutencaoDTO[]>(`${this.baseURL}/${id}`).pipe(
    map((obj) => obj),
    catchError((e) => this.erroHandler(e))
  );
}

GetManutencaoByEquipIdAndAgeId(equipId: string, ageId: string, token: string = null): Observable<ManutencaoDTO> {

  return this.http.get<ManutencaoDTO>(`${this.baseURL}/GetManutencaoByEquipIdAndAgeId?equipamentoId=${equipId}&agendamentoId=${ageId}`).pipe(
    map((obj) => obj),
    catchError((e) => this.erroHandler(e))
  );
}

postManutencao(manutencao: ManutencaoDTO, token: string = null) {
  const options: Object = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
    responseType: "text",
  };

  return this.http.post(this.baseURL, manutencao, options).pipe(
    map((obj) => obj),
    catchError((e) => this.erroHandler(e))
  );
}

postUpload(
  file: File,
  token: string = null
) {
  const fileToUplaod = <File>file[0];
  const formData = new FormData();
  formData.append('file', fileToUplaod, fileToUplaod.name);

  return this.http.post(`${this.baseURL}/upload`, formData).pipe(
    map((obj) => obj));
}

putManutencao(manutencao: ManutencaoDTO, token: string = null) {
  const options: Object = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
    responseType: "text",
  };

  return this.http.put(this.baseURL, manutencao, options).pipe(
    map((obj) => obj),
    catchError((e) => this.erroHandler(e))
  );
}

deleteInspecao(manutencao: ManutencaoDTO, token: string = null) {
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
