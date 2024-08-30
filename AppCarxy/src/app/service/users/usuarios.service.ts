import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService implements OnInit {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {}

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
    console.log('Datos a enviar:', data); // Verifica los datos que se envían
    return this.http.post(`${this.APIUrl}/${endpoint}/`, data);
  }

  login(
    nombre_usuario: string,
    password: string,
    endpoint: string
  ): Observable<any> {
    return this.http
      .post<{ token: string }>(
        `${this.APIUrl}/${endpoint}/`,
        { nombre_usuario, password }, // Envía nombre_usuario y password
        { withCredentials: true } // Con credenciales para manejar la autenticación
      )
      .pipe(
        tap((response) => {
          // Guarda el token en una cookie
          this.setToken(response.token);
        })
      );
  }
  setToken(token: string) {
    const expirationDays = 7; // Establece el tiempo de expiración de la cookie
    this.cookieService.set('token', token, expirationDays, '/');
  }

  getToken(): string {
    return this.cookieService.get('token');
  }

  removeToken() {
    this.cookieService.delete('token', '/');
  }

  logout() {
    // Elimina el token de autenticación
    this.removeToken();

    // Elimina otros datos de usuario almacenados en cookies
    this.cookieService.delete('loggedInUser', '/');

    // Redirige al usuario a la página de login
    this.router.navigate(['/login']);
  }
}
