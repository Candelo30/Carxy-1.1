import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from '../../service/users/usuarios.service';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { PublicationService } from '../../service/publications/publication.service';
import { FormsModule } from '@angular/forms';

import { CookieService } from 'ngx-cookie-service';
import { formatDate, isPlatformBrowser } from '@angular/common';
import { response } from 'express';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidenavComponent, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  nombreUsuario: string = '';
  avatarUsuario: string = '';
  allData: any[] = [];
  isOpenEditing: boolean = false;
  editIndex: number | null = null;
  ModalIsOpen: boolean = false;

  constructor(
    private cookieService: CookieService,

    @Inject(PLATFORM_ID) private platformId: any,

    private UserService: UsuariosService,
    private PublicationsServices: PublicationService,
    private router: Router
  ) {}

  getFormattedDate(dateStr: string): string {
    return formatDate(new Date(dateStr), 'yyyy-MM-dd', 'en-US');
  }

  sortByDate() {
    this.allData.sort((a, b) => {
      // Convertir las fechas de cadena a objetos Date
      const dateA = new Date(a.fecha_publicacion);
      const dateB = new Date(b.fecha_publicacion);
      return dateB.getTime() - dateA.getTime(); // Ordenar de más reciente a más viejo
    });
  }

  shuffleItems() {
    this.allData = this.allData.sort(() => Math.random() - 0.5);
  }

  ShowElements() {
    this.ModalIsOpen = !this.ModalIsOpen;
  }

  ngOnInit(): void {
    const loggedInUser = this.cookieService.get('loggedInUser');
    if (loggedInUser) {
      // Usuario ya está logueado
      const user = JSON.parse(loggedInUser);
      console.log(user);
      this.nombreUsuario = user.nombre_usuario;
      this.avatarUsuario = `https://ui-avatars.com/api/?name=${user.primer_nombre}+${user.primer_apellido}&background=random`;

      // Llama a otros métodos como `publications` si es necesario
      this.publications();
      this.shuffleItems();
    } else {
      // Redirige al login si no está logueado
      this.router.navigate(['/login']);
    }
  }

  publications() {
    if (this.nombreUsuario != null)
      this.PublicationsServices.viewPublications('api/publicaciones').subscribe(
        (data) => {
          this.allData = data;
          console.log(this.allData);
        }
      );
  }

  like(id: number) {
    this.PublicationsServices.likePublication(id).subscribe((response) => {
      alert('Has dado like con éxito');
    });
  }

  DeletePublication(idPublication: string) {
    this.PublicationsServices.deletePublications(
      'api/publicaciones',
      idPublication
    ).subscribe({
      next: (response) => {
        this.publications(); // Actualiza la lista de publicaciones
      },
      error: (error) => {
        console.error('Error al eliminar la publicación:', error);
      },
    });
  }

  actualizarNombreUsuario(): void {
    const usuario = this.UserService.Username;
    const imgUsuario = `https://ui-avatars.com/api/?name=${this.UserService.nameUser}+${this.UserService.FirstSurname}&background=random`;
    if (usuario) {
      this.nombreUsuario = usuario;
      this.avatarUsuario = imgUsuario;
    }

    if (this.nombreUsuario === '') {
      this.router.navigate(['/login']);
    }
  }

  descriptionPublication = {
    descripcion: '',
  };
  BtnIsOpenEditing(idPublication: number): void {
    if (this.editIndex === idPublication) {
      this.isOpenEditing = !this.isOpenEditing;
      if (!this.isOpenEditing) {
        this.editIndex = null;
      }
    } else {
      this.editIndex = idPublication;
      this.isOpenEditing = true;
    }
  }

  UpdatePublication(idPublication: any): void {
    const index = this.allData.findIndex((item) => item.id === idPublication);

    if (index !== -1) {
      // Actualizar la descripción localmente
      this.allData[index].descripcion = this.descriptionPublication.descripcion;

      // Llamar al servicio para actualizar la publicación en el backend
      this.PublicationsServices.updatePublication(
        'api/publicaciones',
        idPublication,
        this.descriptionPublication
      ).subscribe(
        (response) => {
          // Refrescar la publicación si es necesario
          this.BtnIsOpenEditing(idPublication);
          this.publications();
        },
        (error) => {
          console.error('Error updating publication:', error);
          // Podrías agregar más manejo de errores aquí si es necesario
        }
      );
    } else {
      console.error('Publication not found');
    }
  }

  logout(): void {
    this.UserService.logout();
  }

  getSaludo(): string {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Buenos días ☀️';
    } else if (hour < 18) {
      return 'Buenas tardes 🌗';
    } else {
      return 'Buenas noches 🌕';
    }
  }

  // Función para agregar un nuevo carro a la lista
  // addCar() {
  //   const newCar = {
  //     id: this.ListCars.length + 1,
  //     imgCar: '../../assets/Car2.png',
  //     HeartStylesState: false,
  //     Description: '',
  //   };
  //   this.ListCars.push(newCar);
  // }

  // // Función para cambiar el estado del corazón
  // ToggleHeart(CarsID: number) {
  //   const carIndex = this.ListCars.findIndex((car) => car.id === CarsID);
  //   if (carIndex !== -1) {
  //     this.ListCars[carIndex].HeartStylesState =
  //       !this.ListCars[carIndex].HeartStylesState;
  //   }
  // }
}
