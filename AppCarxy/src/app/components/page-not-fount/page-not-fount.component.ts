import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './page-not-fount.component.html',
  styleUrl: './page-not-fount.component.css',
})
export class PageNotFoundComponent {}
