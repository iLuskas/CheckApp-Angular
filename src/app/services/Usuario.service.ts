import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { Usuario } from '../models/Usuario';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  baseURL = 'https://localhost:44363/api/Usuario';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, "x", {
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: isError ? ["msg-error"] : ["msg-sucess"],
    });
  }

  erroHandler(e: any): Observable<any> {
    this.showMessage("Ocorreu um erro!", true);
    return EMPTY;
  }

  getAllUsuario(token: string): Observable<Usuario[]>{
    // const options = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + token
    //   })
    // };

    return this.http.get<Usuario[]>(this.baseURL).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  getUsuarioById(id: number, token: string): Observable<Usuario[]> {
    // const options = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + token
    //   })
    // };

    return this.http.get<Usuario[]>(`${this.baseURL}/${id}`).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  Login(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseURL}/Login`, usuario).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }


  postUsuario(usuario: Usuario, token: string) {
    // const options = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + token
    //   })
    // };
    return this.http.post(this.baseURL, usuario).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  putUsuario(usuario: Usuario, token: string) {
    // const options = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + token
    //   })
    // };

    return this.http.put(this.baseURL, usuario).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  deleteUsuario(usuario: Usuario, token: string) {
    // const options = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + token
    //   }),
    //   body: {
    //     id: sensor.id,
    //     pais: sensor.pais,
    //     regiao: sensor.regiao,
    //     estado: sensor.estado,
    //     valor: sensor.valor,
    //     timeSpan: sensor.timeSpan
    //   }
    // };
    return this.http.delete(`${this.baseURL}/${usuario.id}`).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

}
