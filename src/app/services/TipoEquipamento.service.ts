import { Injectable } from '@angular/core';
import { TipoEquipamentoDTO } from '../models/TipoEquipamentoDTO';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, EMPTY } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TipoEquipamentoService {
  //baseURL = "https://localhost:5001/api/Tipo_Equipamento";
  baseURL = "https://www.safetyplan.net.br/checkapp/api/Tipo_Equipamento";
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

 getAllTipoEquipamento(token: string = null): Observable<TipoEquipamentoDTO[]> {

   return this.http.get<TipoEquipamentoDTO[]>(this.baseURL).pipe(
     map((obj) => obj),
     catchError((e) => this.erroHandler(e))
   );
 }

 getTipoEquipamentoById(id: string, token: string = null): Observable<TipoEquipamentoDTO> {

   return this.http.get<TipoEquipamentoDTO[]>(`${this.baseURL}/${id}`).pipe(
     map((obj) => obj),
     catchError((e) => this.erroHandler(e))
   );
 }

 postTipoEquipamento(tipoEquipamento: TipoEquipamentoDTO, token: string = null) {
   const options: Object = {
     headers: new HttpHeaders({
       "Content-Type": "application/json",
     }),
     responseType: "text",
   };

   return this.http.post(this.baseURL, tipoEquipamento, options).pipe(
     map((obj) => obj),
     catchError((e) => this.erroHandler(e))
   );
 }

 putTipoEquipamento(tipoEquipamento: TipoEquipamentoDTO, token: string = null) {
   const options: Object = {
     headers: new HttpHeaders({
       "Content-Type": "application/json",
     }),
     responseType: "text",
   };

   return this.http.put(this.baseURL, tipoEquipamento, options).pipe(
     map((obj) => obj),
     catchError((e) => this.erroHandler(e))
   );
 }

 deleteTipoEquipamento(tipoEquipamento: TipoEquipamentoDTO, token: string = null) {
   const options: Object = {
     headers: new HttpHeaders({
       'Content-Type': 'application/json',
     }),
     body: {
           id: tipoEquipamento.id,
           pais: tipoEquipamento.tipo
        },
     responseType: 'text'
   };

   return this.http.delete(this.baseURL, options).pipe(
     map((obj) => obj),
     catchError((e) => this.erroHandler(e))
   );
 }
}
