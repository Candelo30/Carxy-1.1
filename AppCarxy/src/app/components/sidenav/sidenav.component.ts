import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UsuariosService } from '../../service/users/usuarios.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent implements OnInit {
  userIsStaff = "";
  constructor(private cookieService: CookieService, private router: Router) {}
  ngOnInit(): void {
    const loggedInUser = this.cookieService.get('loggedInUser');
    if (loggedInUser) {
      // Usuario ya está logueado
      const user = JSON.parse(loggedInUser);
      console.log(user);

      this.userIsStaff = user.rol;
    } else {
      // Redirige al login si no está logueado
      this.router.navigate(['/login']);
    }
  }

  ModalIsOpen: boolean = false;

  ShowElements() {
    this.ModalIsOpen = !this.ModalIsOpen;
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    const target = event.target as HTMLElement;
    const isModal = target.closest('.elementsView');
    const isButton = target.closest('.list-link');

    if (!isModal && !isButton) {
      this.ModalIsOpen = false;
    }
  }
}
