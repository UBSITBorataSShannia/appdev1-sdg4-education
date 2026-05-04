import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

export interface EducationFact {
  id: number;
  country: string;
  indicator: string;
  value: number;
  unit: string;
  year: number;
  source: string;
}

interface WorldBankResponse {
  [0]: { total: number; page: number; pages: number; per_page: number };
  [1]: WorldBankEntry[] | null;
}

interface WorldBankEntry {
  indicator: { id: string; value: string };
  country: { id: string; value: string };
  countryiso3code: string;
  date: string;
  value: number | null;
  unit: string;
  obs_status: string;
  decimal: number;
}

@Injectable({
  providedIn: 'root'
})
export class EducationApiService {
  // World Bank API — literacy rate, adult total (% of people ages 15 and above)
  private readonly API_URL =
    'https://api.worldbank.org/v2/country/PHL;USA;BRA;IND;ZAF;DEU;KEN;VNM/indicator/SE.ADT.LITR.ZS?format=json&mrv=1&per_page=20';

  constructor(private http: HttpClient) {}

  getEducationFacts(): Observable<EducationFact[]> {
    return this.http.get<WorldBankResponse>(this.API_URL).pipe(
      map((response) => {
        const entries = response[1];
        if (!entries) return [];
        return entries
          .filter((e): e is WorldBankEntry & { value: number } => e.value !== null)
          .map((e, i) => ({
            id: i + 1,
            country: e.country.value,
            indicator: e.indicator.value,
            value: Math.round(e.value * 10) / 10,
            unit: '%',
            year: parseInt(e.date, 10),
            source: 'World Bank'
          }));
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'An unexpected error occurred.';
    if (error.status === 0) {
      message = 'Network error — check your connection.';
    } else if (error.status >= 500) {
      message = 'Server error — please try again later.';
    }
    return throwError(() => new Error(message));
  }
}
