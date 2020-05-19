import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, EMPTY } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FuncionarioDTO } from '../models/FuncionarioDTO';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  //baseURL = "https://localhost:5001/api/Funcionario";
  baseURL = "https://www.safetyplan.net.br/checkapp/api/Funcionario";
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

  getAllInfoFuncionario(
    token: string = null
  ): Observable<FuncionarioDTO[]> {
    // const options = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + token
    //   })
    // };

    return this.http
      .get<FuncionarioDTO[]>(`${this.baseURL}/GetAllInfoFuncionario`)
      .pipe(
        map((obj) => obj),
        catchError((e) => this.erroHandler(e))
      );
  }

  getFuncionarioById(
    id: string,
    token: string = null
  ): Observable<FuncionarioDTO> {
    // const options = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + token
    //   })
    // };

    return this.http
      .get<FuncionarioDTO>(
        `${this.baseURL}/getAllInfoFuncionarioById/${id}`
      )
      .pipe(
        map((obj) => obj),
        catchError((e) => this.erroHandler(e))
      );
  }

  postFuncionario(
    funcionarioDTO: FuncionarioDTO,
    token: string = null
  ) {
    const options: Object = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'text'
    };

    return this.http.post(this.baseURL, funcionarioDTO, options).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  putFuncionario(
    funcionarioDTO: FuncionarioDTO,
    token: string = null
  ): Observable<any> {
    const options: Object = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'text'
    };

    return this.http.put(this.baseURL, funcionarioDTO, options).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  deleteFuncionario(
    funcionarioDTO: FuncionarioDTO,
    token: string = null
  ): Observable<any> {
    const options: Object = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        id: funcionarioDTO.id,
        nome: funcionarioDTO.nome,
        email: funcionarioDTO.email,
        cpf: funcionarioDTO.cpf,
        perfilId: funcionarioDTO.perfilId,
        usuarioid: funcionarioDTO.usuarioId,
        enderecoDTOs: funcionarioDTO.enderecoDTOs,
        telefoneDTOs: funcionarioDTO.telefoneDTOs
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
