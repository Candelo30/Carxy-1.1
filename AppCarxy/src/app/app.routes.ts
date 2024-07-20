import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  // { path: 'panel', component: PanelComponent },
  { path: 'register', component: RegisterComponent, pathMatch: 'full' },
  // { path: 'CarsView/:titleCar/:imgCar', component: CarsViewComponent },
  // { path: '404', component: PageNotFoundComponent },
  // { path: '**', redirectTo: '/404' }
];
