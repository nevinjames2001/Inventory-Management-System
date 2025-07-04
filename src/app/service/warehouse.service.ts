import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Warehouse } from '../interface/warehouse';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  private apiURL = "https://localhost:7144/api/Warehouse/";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private httpClient: HttpClient) { }

  getWarehouses(): Observable<Warehouse[]>{
    return this.httpClient.get<Warehouse[]>(this.apiURL)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  getWarehouse(id: number): Observable<Warehouse>{
    return this.httpClient.get<Warehouse>(this.apiURL + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  createWarehouse(warehouse: Warehouse): Observable<Warehouse>{
    return this.httpClient.post<Warehouse>(this.apiURL, JSON.stringify(warehouse), this.httpOptions)
      .pipe(
      catchError(this.errorHandler)
    )
  }

  updateWarehouse(id: number, warehouse: Warehouse): Observable<Warehouse>{
    return this.httpClient.put<Warehouse>(this.apiURL + id, JSON.stringify(warehouse), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  deleteWarehouse(id: number) {
    return this.httpClient.delete<Warehouse>(this.apiURL + id, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }


  errorHandler(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
