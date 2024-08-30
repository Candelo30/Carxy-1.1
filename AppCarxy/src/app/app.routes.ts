import { Routes } from '@angular/router';
<<<<<<< HEAD
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileUSerComponent } from './components/profile-user/profile-user.component';
import { PageNotFoundComponent } from './components/page-not-fount/page-not-fount.component';
import { CarsViewComponent } from './components/cars-view/cars-view.component';
=======
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ProfileUSerComponent } from './profile-user/profile-user.component';
import { PageNotFoundComponent } from './page-not-fount/page-not-fount.component';
import { CarsViewComponent } from './cars-view/cars-view.component';
import { DesignPanelComponent } from './design-panel/design-panel.component';
>>>>>>> 057c3682d38b9e5e2f3edcf83fdea8cb6cf0d7d0

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
