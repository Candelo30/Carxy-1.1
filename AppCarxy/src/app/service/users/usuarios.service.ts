import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  constructor(private http: HttpClient) {}

  idUSer = 0;
  Username = '';
  nameUser = '';
  middleNameUser = '';
  FirstSurname = '';
  SecondSurname = '';
  EmailUSer = '';
  PassWordUSer = '';

  APIUrl = 'http://127.0.0.1:8000';
  getData(endpoint: String): Observable<any> {
    return this.http.get(`${this.APIUrl}/${endpoint}/`);
  }

  getUserExisting(
    idUSer: number,
    Username: string,
    nameUser: string,
    middleNameUser: string,
    FirstSurname: string,
    SecondSurname: string,
    EmailUSer: string,
    PassWordUSer: string
  ) {
    this.idUSer = idUSer;
    this.Username = Username;
    this.nameUser = nameUser;
    this.middleNameUser = middleNameUser;
    this.FirstSurname = FirstSurname;
    this.SecondSurname = SecondSurname;
  }

  addUser(endpoint: String, data: any): Observable<any> {
    return this.http.post(`${this.APIUrl}/${endpoint}/`, data);
  }

  logout(user: string) {
    user = '';
    this.Username = user;
  }
}
