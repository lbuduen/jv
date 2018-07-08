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

  private appPrefix = 'travelNowAsia_';

  constructor(
    private http: HttpClient,
    public snackBar: MatSnackBar
  ) { }

  login(credentials): Observable<any> {
    return this.http.post(`api/users/login`, credentials, httpOptions).pipe(
      tap(user => this.setSession('user', JSON.stringify(user))),
      catchError(this.handleError<any>('Log in'))
    );
  }

  getTotals(): Observable<any> {
    return this.http.get('api/totals');
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
