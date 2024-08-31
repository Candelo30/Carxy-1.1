import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UsuariosService } from '../../service/users/usuarios.service';
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
    nombre_usuario: '', // Nombre de usuario único
    primer_nombre: '', // Primer nombre del usuario
    segundo_nombre: '', // Segundo nombre del usuario (opcional)
    primer_apellido: '', // Primer apellido del usuario
    segundo_apellido: '', // Segundo apellido del usuario (opcional)
    correo: '', // Correo electrónico único
    password: '', // Contraseña del usuario
    rol: 'usuario', // Rol del usuario ('usuario' o 'administrador')
    is_active: true, // Estado de la cuenta (por defecto: true)
    is_staff: false, // Indicador de si es parte del personal (por defecto: false)
    is_superuser: false, // Indicador de si es superusuario (por defecto: false)
    groups: [], // Lista de grupos a los que pertenece el usuario (por defecto: [])
    user_permissions: [], // Lista de permisos específicos del usuario (por defecto: [])
  };

  allData: any[] = [];

  constructor(private UserService: UsuariosService, private router: Router) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.UserService.getData('/api/usuarios').subscribe((data) => {
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
        this.UserService.addUser('register', newUser).subscribe(
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
