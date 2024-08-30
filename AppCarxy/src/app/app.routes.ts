import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileUSerComponent } from './components/profile-user/profile-user.component';
import { PageNotFoundComponent } from './components/page-not-fount/page-not-fount.component';
import { CarsViewComponent } from './components/cars-view/cars-view.component';

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
