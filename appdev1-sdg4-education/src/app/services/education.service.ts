import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of, startWith, finalize, BehaviorSubject } from 'rxjs';
import { OpenLibraryResponse, OpenLibraryDoc, Country } from 'src/app/models/education-resource.model';

@Injectable({
  providedIn: 'root'
})
export class EducationService {
  private readonly http = inject(HttpClient);

  private readonly OPEN_LIBRARY_API = 'https://openlibrary.org/search.json';
  private readonly REST_COUNTRIES_API = 'https://restcountries.com/v3.1';

  private loadingBooks = new BehaviorSubject<boolean>(false);
  private loadingCountries = new BehaviorSubject<boolean>(false);

  isLoadingBooks$ = this.loadingBooks.asObservable();
  isLoadingCountries$ = this.loadingCountries.asObservable();

  /**
   * Fetch education-related books from Open Library API
   * Returns Observable — use async pipe in templates, NO subscribe() in components
   */
  getEducationBooks(query: string = 'quality education SDG'): Observable<OpenLibraryDoc[]> {
    this.loadingBooks.next(true);
    const params = new HttpParams()
      .set('q', query)
      .set('limit', '12')
      .set('fields', 'key,title,author_name,first_publish_year,subject,cover_i,publisher,edition_count');

    return this.http.get<OpenLibraryResponse>(this.OPEN_LIBRARY_API, { params }).pipe(
      map(response => response.docs),
      catchError(err => {
        console.error('Error fetching books:', err);
        return of([]);
      }),
      finalize(() => this.loadingBooks.next(false))
    );
  }

  /**
   * Fetch countries data from REST Countries API
   * Returns Observable — use async pipe in templates
   */
  getCountriesByRegion(region: string = 'Asia'): Observable<Country[]> {
    this.loadingCountries.next(true);
    return this.http.get<Country[]>(`${this.REST_COUNTRIES_API}/region/${region}`).pipe(
      map(countries => countries.slice(0, 20)),
      catchError(err => {
        console.error('Error fetching countries:', err);
        return of([]);
      }),
      finalize(() => this.loadingCountries.next(false))
    );
  }

  /**
   * Search books by specific topic
   */
  searchBooks(query: string): Observable<OpenLibraryDoc[]> {
    return this.getEducationBooks(query);
  }
}