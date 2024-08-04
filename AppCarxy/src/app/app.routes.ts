import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ProfileUSerComponent } from './profile-user/profile-user.component';
import { PageNotFoundComponent } from './page-not-fount/page-not-fount.component';
import { CarsViewComponent } from './cars-view/cars-view.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileUSerComponent },
  // { path: 'panel', component: PanelComponent },
  { path: 'register', component: RegisterComponent, pathMatch: 'full' },
  { path: 'CarsView', component: CarsViewComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' },
];
