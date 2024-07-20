import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from '../service/users/usuarios.service';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { PublicationService } from '../service/publications/publication.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidenavComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  nombreUsuario: string = '';
  avatarUsuario: string = '';
  allData: any[] = [];

  constructor(
    private UserService: UsuariosService,
    private PublicationsServices: PublicationService,
    private router: Router
  ) {}

  ModalIsOpen: boolean = false;

  ShowElements() {
    this.ModalIsOpen = !this.ModalIsOpen;
  }

  ngOnInit(): void {
    this.actualizarNombreUsuario();
    this.publications();
    this.getCarImages();
  }

  publications() {
    this.PublicationsServices.viewPublications('publicaciones').subscribe(
      (data) => {
        this.allData = data;
      }
    );
    this.getCarImages();
  }

  getCarImages() {
    this.PublicationsServices.searchPhotos(
      'car',
      this.allData.length
    ).subscribe(
      (response) => {
        for (let i = 0; i < this.allData.length; i++) {
          this.allData[i].image =
            response.photos[i % response.photos.length].src.medium; // Asignar imagen a cada elemento
        }
      },
      (error) => {
        console.error('Error fetching car images:', error);
      }
    );
  }

  actualizarNombreUsuario(): void {
    const usuario = this.UserService.userExisting;
    const imgUsuario = `https://ui-avatars.com/api/?name=${this.UserService.nameUser}+${this.UserService.lastNameUser}&background=random`;
    if (usuario) {
      this.nombreUsuario = usuario;
      this.avatarUsuario = imgUsuario;
    }

    if (this.nombreUsuario === '') {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.UserService.logout(this.UserService.userExisting);
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

  // ListCars = [
  //   {
  //     id: 1,
  //     imgCar: '/assets/Car2.png',
  //     HeartStylesState: false,
  //     Description: '',
  //   },
  // ];

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
