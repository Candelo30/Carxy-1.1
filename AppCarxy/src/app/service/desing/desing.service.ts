import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DesingService {
  constructor(private http: HttpClient) {}

  APIUrl = 'http://127.0.0.1:8000';

  // List Cars

  getCars(endpoint: string): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer YOUR_TOKEN_HERE'
    );
    return this.http.get(`${this.APIUrl}/${endpoint}/`, { headers });
  }

  // Personalizations

  getPersonalizations(endpoint: string, idUser: number): Observable<any> {
    return this.http.get(`${this.APIUrl}/${endpoint}?usuario_id=${idUser}`);
  }

  createPersonalization(endpoint: string, data: any): Observable<any> {
    console.log(`${this.APIUrl}/${endpoint}/`);
    return this.http.post(`${this.APIUrl}/${endpoint}/`, data);
  }

  updatePersonalization(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.APIUrl}/${id}`, data);
  }

  deletePersonalization(id: number): Observable<any> {
    return this.http.delete<any>(`${this.APIUrl}/${id}`);
  }

  getParts(url: string) {
    return this.http.get<any[]>(url);
  }

  // http://127.0.0.1:8000/api/personalizaciones/1/modelo/

  getModelUrl(personalizationId: number): Observable<{ modelUrl: string }> {
    return this.http.get<{ modelUrl: string }>(
      `${this.APIUrl}/api/personalizaciones/${personalizationId}/modelo/`
    );
  }

  getColors(endpoint: string) {
    return this.http.get(`${this.APIUrl}/${endpoint}/`);
  }
}
