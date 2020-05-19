import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, EMPTY } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { PerfilDTO } from "../models/PerfilDTO";

@Injectable({
  providedIn: "root",
})
export class PerfilService {
 // baseURL = "https://localhost:5001/api/Perfil";
  baseURL = "https://www.safetyplan.net.br/checkapp/api/Perfil";
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

  getAllPerfil(token: string = null): Observable<PerfilDTO[]> {

    return this.http.get<PerfilDTO[]>(this.baseURL).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  getPerfilById(id: string, token: string = null): Observable<PerfilDTO> {

    return this.http.get<PerfilDTO[]>(`${this.baseURL}/${id}`).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  postPerfil(perfil: PerfilDTO, token: string = null) {
    const options: Object = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      responseType: "text",
    };

    return this.http.post(this.baseURL, perfil, options).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  putPerfil(perfil: PerfilDTO, token: string = null) {
    const options: Object = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      responseType: "text",
    };

    return this.http.put(this.baseURL, perfil, options).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  deletePerfil(perfil: PerfilDTO, token: string = null) {
    const options: Object = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
            id: perfil.id,
            pais: perfil.funcao_perfil
         },
      responseType: 'text'
    };

    return this.http.delete(this.baseURL, options).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }
}
