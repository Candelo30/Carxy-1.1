import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PublicationService {
  constructor(private http: HttpClient) {}

  private apiUrlPexel = 'https://api.pexels.com/v1';
  private apiKey = 'H4npBNy8qNkMn788obRdka1cxnAUEkFUSMckEya6WKwXLXx93S2ybwBR';

  // H4npBNy8qNkMn788obRdka1cxnAUEkFUSMckEya6WKwXLXx93S2ybwBR

  APIUrl = 'http://localhost:3002';
  viewPublications(endpoint: String): Observable<any> {
    return this.http.get(`${this.APIUrl}/${endpoint}`);
  }

  searchPhotos(query: string, perPage: number = 10): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.apiKey);
    const params = new HttpParams()
      .set('query', query)
      .set('per_page', perPage.toString());

    return this.http.get(`${this.apiUrlPexel}/search`, { headers, params });
  }
}
