import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from '../service/users/usuarios.service';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { PublicationService } from '../service/publications/publication.service';
import { FormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';

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

  constructor(
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

  ModalIsOpen: boolean = false;

  ShowElements() {
    this.ModalIsOpen = !this.ModalIsOpen;
  }

  ngOnInit(): void {
    this.actualizarNombreUsuario();
    this.publications();
    this.shuffleItems();
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
    this.UserService.logout(this.UserService.Username);
    window.location.reload(); // Recarga la página
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
