import { Component, OnInit } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { UsuariosService } from '../service/users/usuarios.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { PublicationService } from '../service/publications/publication.service';
import { FormsModule, NgForm } from '@angular/forms';
import { response } from 'express';

@Component({
  selector: 'app-profile-user',
  standalone: true,
  imports: [SidenavComponent, FormsModule],
  templateUrl: './profile-user.component.html',
  styleUrl: './profile-user.component.css',
})
export class ProfileUSerComponent implements OnInit {
  nombreUsuario: string = '';
  avatarUsuario: string = '';
  nameUser = '';
  middleNameUser = '';
  FirstSurname = '';
  SecondSurname = '';
  ModalIsOpen: boolean = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  OpenCreateNewPublication: boolean = false;
  idUser = 0;
  base64Image: string | null = null; // Variable de clase para la imagen en base64
  allData: any = [];
  descripcion = '';

  constructor(
    private UserService: UsuariosService,
    private PublicationsServices: PublicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      this.nombreUsuario = user.nombre_usuario;
      this.avatarUsuario = `https://ui-avatars.com/api/?name=${user.primer_nombre}+${user.primero_apellido}&background=random`;

      // Asignar más información del usuario
      this.idUser = user.id;
      this.nameUser = user.primer_nombre;
      this.middleNameUser = user.segundo_nombre;
      this.FirstSurname = user.primero_apellido;
      this.SecondSurname = user.segundo_apellido;

      // Llamar a otros métodos como `publications` si es necesario
      this.publications(user.id);
    } else {
      this.router.navigate(['/login']);
    }
  }

  actualizarNombreUsuario(): void {
    const usuario = this.UserService.Username;
    const imgUsuario = `https://ui-avatars.com/api/?name=${this.UserService.nameUser}+${this.UserService.FirstSurname}&background=random`;
    if (usuario) {
      this.nombreUsuario = usuario;
      this.avatarUsuario = imgUsuario;
      this.idUser = this.UserService.idUSer;
      this.nameUser = this.UserService.nameUser;
      this.middleNameUser = this.UserService.middleNameUser;
      this.FirstSurname = this.UserService.FirstSurname;
      this.SecondSurname = this.UserService.SecondSurname;
    }

    if (this.nombreUsuario === '') {
      this.router.navigate(['/login']);
    }
  }

  submitPublication() {
    const newPublication = {
      nombre_usuario: this.idUser,
      descripcion: this.descripcion,
      fecha_publicacion: new Date().toISOString(), // Usar formato ISO
      me_gusta: 0,
      no_me_gusta: 0,
      imagen: this.base64Image, // Añadir imagen en base64
    };

    if (newPublication.descripcion !== '') {
      this.PublicationsServices.addPublication(newPublication).subscribe(
        (response) => {
          alert('Datos enviados con éxito');
          window.location.reload();
          this.clearFields();
        },
        (error) => {
          console.error('Error al crear la publicación', error);
        }
      );
    } else {
      alert(
        'Las publicaciones deben tener una descripción. No dejes este campo vacío, por favor.'
      );
    }
  }

  clearFields() {
    this.descripcion = '';
    this.previewUrl = null;
    this.selectedFile = null;
    this.base64Image = null;
    this.OpenCreateNewPublication = false;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.base64Image = reader.result as string;
        this.previewUrl = this.base64Image; // Mostrar la imagen previa
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  getFormattedDate(dateStr: string): string {
    return formatDate(new Date(dateStr), 'yyyy-MM-dd', 'en-US');
  }

  BtnOpenCreateNewPublication() {
    this.OpenCreateNewPublication = !this.OpenCreateNewPublication;
  }

  ShowElements() {
    this.ModalIsOpen = !this.ModalIsOpen;
  }

  publications(id: number) {
    if (this.nombreUsuario != null)
      this.PublicationsServices.viewPublicationsForUser(
        'api/publicaciones',
        id
      ).subscribe((data) => {
        this.allData = data;
        console.log(this.allData);
      });
  }

  logout(): void {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']); // Redirige al login en lugar de recargar la página
  }
}
