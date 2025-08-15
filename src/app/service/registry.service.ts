import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistryService {
    httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private httpClient: HttpClient) { }

  getRegistries(apiURL:string): Observable<any[]>{
    return this.httpClient.get<any[]>(apiURL)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  getRegistry(apiURL: string, id: number): Observable<any>{
    return this.httpClient.get<any>(apiURL + id)
       .pipe(
        catchError(this.errorHandler)
    )
  }

  createRegistry(apiURL:string,register: any): Observable<any>{
    return this.httpClient.post<any>(apiURL, JSON.stringify(register), this.httpOptions)
             .pipe(
          catchError(this.errorHandler)
      )
  }

  updateRegistry(register: any, apiURL: string): Observable<any>{
      console.log(register,apiURL)
      return this.httpClient.put<any>(apiURL , JSON.stringify(register), this.httpOptions)
          .pipe(
        catchError(this.errorHandler)
      )
    }

    deleteCategory(id: number,apiURL:string) {
      return this.httpClient.delete<any>(apiURL + id, this.httpOptions)
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
