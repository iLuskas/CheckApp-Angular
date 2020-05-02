import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpClient } from "@angular/common/http";
import { Product } from "./product.model";
import { Observable, EMPTY } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { isError } from "util";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  baseUrl = "http://localhost:3001/products";
  constructor(private snackBar: MatSnackBar, private http: HttpClient) {}

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, "x", {
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: isError ? ["msg-error"] : ["msg-sucess"],
    });
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  erroHandler(e: any): Observable<any> {
    this.showMessage("Ocorreu um erro!", true);
    return EMPTY;
  }

  read(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  readById(id: string): Observable<Product> {
    const uri = `${this.baseUrl}/${id}`;
    return this.http.get<Product>(uri).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }

  update(product: Product): Observable<Product> {
    return this.http
      .put<Product>(`${this.baseUrl}/${product.id}`, product)
      .pipe(
        map((obj) => obj),
        catchError((e) => this.erroHandler(e))
      );
  }

  delete(id: string): Observable<Product> {
    return this.http.delete<Product>(`${this.baseUrl}/${id}`).pipe(
      map((obj) => obj),
      catchError((e) => this.erroHandler(e))
    );
  }
}
