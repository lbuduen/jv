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
export class ActivityService {

  private apiURL = 'api/activities';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  create(activity): Observable<any> {
    return this.http.post(this.apiURL, activity, { headers: new HttpHeaders() }).pipe(
      catchError(this.handleError('Create activity'))
    );
  }

  list(): Observable<any> {
    return this.http.get(this.apiURL);
  }

  read(id: String): Observable<any> {
    return this.http.get(`${this.apiURL}/${id}`);
  }

  update(id, activity): Observable<any> {
    return this.http.put(`${this.apiURL}/${id}`, activity, { headers: new HttpHeaders() }).pipe(
      catchError(this.handleError('Update activity'))
    );
  }

  delete(id: String): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }

  getActivityContacts(): Observable<any> {
    return this.http.get(`${this.apiURL}/contacts`);
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
