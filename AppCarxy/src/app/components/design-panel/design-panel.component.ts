import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { DesingService } from '../../service/desing/desing.service';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../service/users/usuarios.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-design-panel',
  standalone: true,
  imports: [RouterLink, SidenavComponent, FormsModule],
  templateUrl: './design-panel.component.html',
  styleUrl: './design-panel.component.css',
})
export class DesignPanelComponent implements OnInit {
  TotalCars: number = 0;
  listCartsDesing: any[] = [];
  IsOpenModal: boolean = false;
  availableCars: any[] = [];
  selectedCar: any = null;
  selectedTitle: string = '';
  selectedDate: Date = new Date();
  isLoading: boolean = false;
  idUser = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private route: ActivatedRoute,
    private desingService: DesingService,
    private userServices: UsuariosService, // Corregido el nombre del servicio a 'userServices'
    private router: Router
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const loggedInUser = localStorage.getItem('loggedInUser');
      if (loggedInUser) {
        const user = JSON.parse(loggedInUser);
        this.idUser = user.id;
        this.getDataCars();
        this.getPersonalizations();
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  OpenModalAddCar() {
    this.IsOpenModal = !this.IsOpenModal;
  }

  // Método para obtener los carros disponibles
  getDataCars() {
    this.isLoading = true;
    this.desingService.getCars('api/carros').subscribe(
      (data) => {
        this.availableCars = data;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  // Método para obtener personalizaciones
  getPersonalizations() {
    this.isLoading = true;
    this.desingService
      .getPersonalizations('api/personalizaciones', this.idUser)
      .subscribe(
        (data) => {
          this.listCartsDesing = data;
          this.TotalCars = data.length;
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }

  // Método para guardar una personalización
  savePersonalization() {
    if (this.selectedCar && this.selectedTitle.trim()) {
      const newPersonalization = {
        nombre_personalizacion: this.selectedTitle,
        carro: this.selectedCar.id,
        usuario: this.idUser,
        fecha_creacion: new Date().toISOString(),
      };

      this.desingService
        .createPersonalization('api/personalizaciones', newPersonalization)
        .subscribe((data) => {
          this.listCartsDesing.push(data);
          this.TotalCars++;
          this.OpenModalAddCar();
        });
    } else {
    }
  }

  // Método para eliminar una personalización
  deleteCar(id: number) {
    this.desingService.deletePersonalization(id).subscribe(() => {
      this.listCartsDesing = this.listCartsDesing.filter(
        (item) => item.id !== id
      );
      this.TotalCars--;
    });
  }
}
