import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../service/users/usuarios.service';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  nombre_usuario: string = '';
  password: string = '';

  constructor(
    private userService: UsuariosService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    this.userService
      .login(this.nombre_usuario, this.password, 'login')
      .subscribe(
        (response) => {
          alert('Inicio de sesión exitoso');

          // Guarda el token en una cookie
          this.userService.setToken(response.token);
          console.log('Este es el Token: ', response.token);

          // Guarda los datos del usuario en una cookie
          this.cookieService.set(
            'loggedInUser',
            JSON.stringify(response.user),
            7
          ); // Expira en 7 días

          // Redirige al usuario a la página de inicio
          this.router.navigate(['/home']);
        },
        (error) => {
          alert('Credenciales incorrectas');
          this.password = '';
        }
      );
  }
}
