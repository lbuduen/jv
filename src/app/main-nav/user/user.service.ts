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
export class UserService {
  private apiURL = 'api/users';  // URL to web api

  constructor(
    private http: HttpClient,
    public snackBar: MatSnackBar
  ) { }

  create(user): Observable<any> {
    return this.http.post(this.apiURL, user, httpOptions).pipe(
      catchError(this.handleError('Create user'))
    );
  }

  read(id: String): Observable<any> {
    return this.http.get(`${this.apiURL}/${id}`);
  }

  update(id, user): Observable<any> {
    return this.http.put(`${this.apiURL}/${id}`, user, httpOptions).pipe(
      catchError(this.handleError('Update user'))
    );
  }

  list(): Observable<any> {
    return this.http.get(this.apiURL);
  }

  delete(id: String): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
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
