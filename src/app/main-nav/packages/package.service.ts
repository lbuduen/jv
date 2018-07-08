import { Injectable } from "@angular/core";

import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { MatSnackBar } from "@angular/material";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class PackageService {
  private apiURL = "api/packages";

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  create(pkg): Observable<any> {
    return this.http
      .post(this.apiURL, pkg, { headers: new HttpHeaders() })
      .pipe(catchError(this.handleError("Create package")));
  }

  list(): Observable<any> {
    return this.http.get(this.apiURL);
  }

  read(id: String): Observable<any> {
    return this.http.get(`${this.apiURL}/${id}`);
  }

  setUp(id, pkg): Observable<any> {
    return this.http
      .patch(`${this.apiURL}/${id}`, pkg, httpOptions)
      .pipe(catchError(this.handleError("set up package")));
  }

  update(id, pkg): Observable<any> {
    return this.http
      .put(`${this.apiURL}/${id}`, pkg, httpOptions)
      .pipe(catchError(this.handleError("update package details")));
  }

  delete(id: String): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }

  get(route): Observable<any> {
    return this.http.get(`${this.apiURL}/${route}`);
  }

  setStatus(pkg, customer, status): Observable<any> {
    return this.http.put(
      `${this.apiURL}/status`,
      {
        pkg: pkg,
        customer: customer,
        status: status
      },
      httpOptions
    );
  }

  removeCustomer(pkg, customer): Observable<any> {
    return this.http.patch(
      `${this.apiURL}/remove/customer`,
      {
        pkg: pkg,
        customer: customer
      },
      httpOptions
    );
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.snackBar.open(`${operation} failed: ${error.error.message}`, "", {
        duration: 3000
      });
      return of(result as T);
    };
  }
}
