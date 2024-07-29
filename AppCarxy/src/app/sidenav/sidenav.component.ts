import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent {
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
