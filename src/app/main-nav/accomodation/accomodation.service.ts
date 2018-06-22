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
export class AccomodationService {

  private apiURL = 'api/accomodation';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  create(accomodation): Observable<any> {
    return this.http.post(this.apiURL, accomodation, { headers: new HttpHeaders() }).pipe(
      catchError(this.handleError('Create accomodation'))
    );
  }

  list(): Observable<any> {
    return this.http.get(this.apiURL);
  }

  read(id: String): Observable<any> {
    return this.http.get(`${this.apiURL}/${id}`);
  }

  update(id, accomodation): Observable<any> {
    return this.http.put(`${this.apiURL}/${id}`, accomodation, { headers: new HttpHeaders() }).pipe(
      catchError(this.handleError('Update accomodation'))
    );
  }

  delete(id: String): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }

  getAccomodationContacts(): Observable<any> {
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
