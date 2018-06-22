import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { catchError, map, tap } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TransportationService {

  private apiURL = 'api/transportation';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  create(means, transport): Observable<any> {
    return this.http.post(`${this.apiURL}/${means}`, transport, { headers: new HttpHeaders() }).pipe(
      catchError(this.handleError('Create transportation'))
    );
  }

  list(means): Observable<any> {
    return this.http.get(`${this.apiURL}/${means}`);
  }

  read(means, id: String): Observable<any> {
    return this.http.get(`${this.apiURL}/${means}/${id}`);
  }

  update(means, id, transport): Observable<any> {
    return this.http.put(`${this.apiURL}/${means}/${id}`, transport, { headers: new HttpHeaders() }).pipe(
      catchError(this.handleError('Update transportation'))
    );
  }

  delete(means, id: String): Observable<any> {
    return this.http.delete(`${this.apiURL}/${means}/${id}`);
  }

  getDrivers(): Observable<any> {
    return this.http.get(`${this.apiURL}/drivers`);
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.snackBar.open(`${operation} failed: ${error.error.message}`, '', {
        duration: 3000,
      });
      return of(result as T);
    }
  }
}
