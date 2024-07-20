import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  constructor(private http: HttpClient) {}

  userExisting = '';
  nameUser = '';
  lastNameUser = '';

  APIUrl = 'http://localhost:3002';
  getData(endpoint: String): Observable<any> {
    return this.http.get(`${this.APIUrl}/${endpoint}`);
  }

  getUserExisting(username: string, nameUser: string, lastName: string) {
    this.userExisting = username;
    this.nameUser = nameUser;
    this.lastNameUser = lastName;
  }

  addUser(endpoint: String, data: any): Observable<any> {
    return this.http.post(`${this.APIUrl}/${endpoint}`, data);
  }

  logout(user: string) {
    user = '';
    this.userExisting = user;
  }
}
