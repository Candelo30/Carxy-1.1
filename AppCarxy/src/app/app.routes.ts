import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ProfileUSerComponent } from './profile-user/profile-user.component';
import { PageNotFoundComponent } from './page-not-fount/page-not-fount.component';
import { CarsViewComponent } from './cars-view/cars-view.component';
import { DesignPanelComponent } from './design-panel/design-panel.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileUSerComponent },
  { path: 'Desing-panel', component: DesignPanelComponent },
  { path: 'register', component: RegisterComponent, pathMatch: 'full' },
  { path: 'cars-view:id', component: CarsViewComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' },
];
