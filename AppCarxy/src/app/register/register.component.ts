import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UsuariosService } from '../service/users/usuarios.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  user = {
    nombre_usuario: '',
    primer_nombre: '',
    segundo_nombre: '',
    primero_apellido: '',
    segundo_apellido: '',
    correo: '',
    contrasena: '',
  };
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

  onSubmit(form: NgForm) {
    if (form.valid) {
      const newUser = this.user;
      const userExists = this.allData.some(
        (user) => user.nombre_usuario === newUser.nombre_usuario
      );

      if (userExists) {
        alert('El usuario ya existe');
      } else {
        this.UserService.addUser('api/usuario', newUser).subscribe(
          (response) => {
            alert('Has hecho el registro con éxito');
            this.router.navigate(['/login']);
          },
          (error) => {
            alert('Hubo un error al registrar el usuario');
            console.error(error);
          }
        );
      }
    } else {
      alert('Por favor, completa el formulario correctamente.');
    }
  }
}
