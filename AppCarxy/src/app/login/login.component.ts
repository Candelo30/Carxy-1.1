import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../service/users/usuarios.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // Corregido de styleUrl a styleUrls
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  URLimageUser = '';
  allData: any[] = [];

  constructor(private UserService: UsuariosService, private router: Router) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.UserService.getData('api/usuario').subscribe((data) => {
      this.allData = data;
    });
  }

  onSubmit() {
    const user = this.allData.find(
      (user) =>
        user.nombre_usuario === this.username &&
        user.contrasena === this.password
    );
    if (user) {
      alert('Sus datos son correctos');

      // Almacenar el usuario en localStorage
      localStorage.setItem('loggedInUser', JSON.stringify(user));

      this.router.navigate(['/home']);
      this.UserService.getUserExisting(
        user.id,
        user.nombre_usuario,
        user.primer_nombre,
        user.segundo_nombre,
        user.primero_apellido,
        user.segundo_apellido,
        user.correo,
        user.contrasena
      );
    } else {
      alert('Sus datos son incorrectos');

      this.password = '';
    }
  }
}
