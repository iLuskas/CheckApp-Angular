import { Injectable } from "@angular/core";
import { Observable, EMPTY } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EmpresaClienteDTO } from "../models/EmpresaClienteDTO";
import { MatSnackBar } from "@angular/material/snack-bar";
import { map, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class EmpresaClienteService {
   baseURL = "https://www.safetyplan.net.br/checkapp/api/EmpresaCliente";
  //baseURL = "https://localhost:44363/api/EmpresaCliente";

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

  getAllEmpresaCliente(token: string = null): Observable<EmpresaClienteDTO[]> {
    // const options = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + token
    //   })
    // };

    return this.http.get<EmpresaClienteDTO[]>(this.baseURL).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  getAllInfoEmpresaCliente(
    token: string = null
  ): Observable<EmpresaClienteDTO[]> {
    // const options = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + token
    //   })
    // };

    return this.http
      .get<EmpresaClienteDTO[]>(`${this.baseURL}/GetAllInfoEmpresa`)
      .pipe(
        map((obj) => obj),
        catchError((e) => this.erroHandler(e))
      );
  }

  getEmpresaClienteById(
    id: string,
    token: string = null
  ): Observable<EmpresaClienteDTO> {
    // const options = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + token
    //   })
    // };

    return this.http
      .get<EmpresaClienteDTO>(
        `${this.baseURL}/getAllInfoEmpresaClienteById/${id}`
      )
      .pipe(
        map((obj) => obj),
        catchError((e) => this.erroHandler(e))
      );
  }

  postEmpresaCliente(
    empresaClienteDTO: EmpresaClienteDTO,
    token: string = null
  ) {
    const options: Object = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'text'
    };

    return this.http.post(this.baseURL, empresaClienteDTO, options).pipe(
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

  putEmpresaCliente(
    empresaClienteDTO: EmpresaClienteDTO,
    token: string = null
  ): Observable<any> {
    const options: Object = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'text'
    };

    return this.http.put(this.baseURL, empresaClienteDTO, options).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  deleteEmpresaCliente(
    empresaClienteDTO: EmpresaClienteDTO,
    token: string = null
  ): Observable<any> {
    const options: Object = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        id: empresaClienteDTO.id,
        razaoSocial: empresaClienteDTO.razaoSocial,
        cnpj: empresaClienteDTO.cnpj,
        inscricao_estadual: empresaClienteDTO.inscricao_estadual,
        enderecoDTOs: empresaClienteDTO.enderecoDTOs,
        telefoneDTOs: empresaClienteDTO.telefoneDTOs
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
