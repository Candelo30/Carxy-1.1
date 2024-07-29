import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PublicationService {
  constructor(private http: HttpClient) {}

  APIUrl = 'http://127.0.0.1:8000';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; multipart/form-data; charset=UTF-8',
    }),
  };

  viewPublications(endpoint: string): Observable<any> {
    console.log(`${this.APIUrl}/${endpoint}`);
    return this.http.get(`${this.APIUrl}/${endpoint}/`, this.httpOptions);
  }

  viewPublicationsForUser(endpoint: string, idUser: number): Observable<any> {
    return this.http.get(
      `${this.APIUrl}/${endpoint}?nombre_usuario_id=${idUser}`,
      this.httpOptions
    );
  }
  deletePublications(endpoint: string, param: string): Observable<any> {
    return this.http.delete(
      `${this.APIUrl}/${endpoint}/${param}/`,
      this.httpOptions
    );
  }

  updatePublication(
    endpoint: string,
    param: string,
    data: any
  ): Observable<any> {
    return this.http.patch(
      `${this.APIUrl}/${endpoint}/${param}/`,
      data,
      this.httpOptions
    );
  }

  addPublication(data: any): Observable<any> {
    return this.http.post(
      `${this.APIUrl}/api/publicaciones/`,
      JSON.stringify(data),
      this.httpOptions
    );
  }
}
