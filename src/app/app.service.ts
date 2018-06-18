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
export class AppService {

  private apiURL = 'api/users';  // URL to web api
  private appPrefix = 'travelOnAsia_';

  constructor(
    private http: HttpClient,
    public snackBar: MatSnackBar
  ) { }

  create(user): Observable<any> {
    return this.http.post(this.apiURL, user, httpOptions);
  }

  login(credentials): Observable<any> {
    return this.http.post(`${this.apiURL}/login`, credentials, httpOptions).pipe(
      tap(user => this.setSession('user', JSON.stringify(user))),
      catchError(this.handleError<any>('Log in'))
    );
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

  getSession(elem: string) {
    return window.localStorage.getItem(this.appPrefix + elem);
  }

  setSession(elem: string, val: any) {
    window.localStorage.setItem(this.appPrefix + elem, val);
  }

  removeSession(elem: string) {
    window.localStorage.removeItem(this.appPrefix + elem);
  }
}
