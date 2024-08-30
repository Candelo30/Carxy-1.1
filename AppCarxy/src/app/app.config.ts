import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
<<<<<<< HEAD
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { authInterceptor } from './interceptor/auth.interceptor';
=======
import { provideHttpClient, withFetch } from '@angular/common/http';
>>>>>>> 057c3682d38b9e5e2f3edcf83fdea8cb6cf0d7d0

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
<<<<<<< HEAD
    provideHttpClient(withInterceptors([authInterceptor])),

    CookieService, // Asegúrate de incluir el servicio de cookies
=======
    provideHttpClient(withFetch()),
>>>>>>> 057c3682d38b9e5e2f3edcf83fdea8cb6cf0d7d0
  ],
};
