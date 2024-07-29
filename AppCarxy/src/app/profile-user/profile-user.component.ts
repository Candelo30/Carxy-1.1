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
  constructor(
    private UserService: UsuariosService,
    private PublicationsServices: PublicationService,
    private router: Router
  ) {}

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

  allData: any = [];
  descripcion = '';

  actualizarNombreUsuario(): void {
    const usuario = this.UserService.Username;
    const imgUsuario = `https://ui-avatars.com/api/?name=${this.UserService.nameUser}+${this.UserService.FirstSurname}&background=random`;
    if (usuario) {
      this.nombreUsuario = usuario;
      this.avatarUsuario = imgUsuario;

      // additional information User

      this.idUser = this.UserService.idUSer;
      console.log(this.idUser);
      this.nameUser = this.UserService.nameUser;
      this.middleNameUser = this.UserService.middleNameUser;
      this.FirstSurname = this.UserService.FirstSurname;
      this.SecondSurname = this.UserService.SecondSurname;
    }

    if (this.nombreUsuario === '') {
      this.router.navigate(['/login']);
    }
  }

  //

  submitPublication() {
    const newPublication = {
      nombre_usuario: `${this.idUser}`,
      descripcion: `${this.descripcion}`,
      fecha_publicacion: `${new Date().toISOString()}`, // Usar formato ISO
      me_gusta: 0,
      no_me_gusta: 0,
    };
    if (newPublication.descripcion != '') {
      this.PublicationsServices.addPublication(newPublication).subscribe(
        (response) => {
          alert('Datos enviados con éxito');
          window.location.reload();

          this.clearFields(); // Limpiar los campos después de enviar
        },
        (error) => {
          console.error('Error al crear la publicación', error);
          console.error('Detalles del error:', error.error); // Añadir esta línea para detalles del error
          console.log(
            'Este es el nombre de usuario',
            newPublication.nombre_usuario
          );
        }
      );
    } else {
      alert(
        'Las publicaciones tienen una descripción\n No dejes este campo vació por favor'
      );
    }
  }

  clearFields() {
    this.descripcion = '';
    this.previewUrl = null;
    this.selectedFile = null;
    this.OpenCreateNewPublication = false;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  //

  getFormattedDate(dateStr: string): string {
    return formatDate(new Date(dateStr), 'yyyy-MM-dd', 'en-US');
  }

  BtnOpenCreateNewPublication() {
    this.OpenCreateNewPublication = !this.OpenCreateNewPublication;
  }

  ngOnInit(): void {
    this.actualizarNombreUsuario();
    this.publications();
  }

  ShowElements() {
    this.ModalIsOpen = !this.ModalIsOpen;
  }

  publications() {
    if (this.nombreUsuario != null)
      this.PublicationsServices.viewPublicationsForUser(
        'api/publicaciones',
        this.UserService.idUSer
      ).subscribe((data) => {
        this.allData = data;
        console.log(this.allData);
      });
  }

  logout(): void {
    this.UserService.logout(this.UserService.Username);
    window.location.reload(); // Recarga la página
  }
}
