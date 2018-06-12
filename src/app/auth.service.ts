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
export class AuthService {

  redirectUrl: string;

  constructor(
    private http: HttpClient,
    public snackBar: MatSnackBar
  ) { }

  login(credentials): Observable<any> {
    return this.http.post('api/users/login', credentials, httpOptions).pipe(
      tap(user => {
        window.localStorage.setItem('travelOnAsia_user', JSON.stringify(user));
      }),
      catchError(this.handleError<any>('Log in', false))
    );
  }

  logout(): void {
    window.localStorage.removeItem('travelOnAsia_user');
  }

  isLoggedIn(): boolean {
    return Boolean(window.localStorage.getItem('travelOnAsia_user'));
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
