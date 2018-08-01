import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiURL = "api/dashboard";

  constructor(
    private http: HttpClient
  ) { }

  getSummary(startDate, endDate?): Observable<any> {
    const dates = {
      startDate: startDate,
      endDate: endDate
    };

    if (!endDate) {
      delete dates.endDate;
    }
    return this.http.post(`${this.apiURL}/summary`, dates);
  }
}
