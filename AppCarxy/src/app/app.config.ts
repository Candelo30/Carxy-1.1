import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';
import { authInterceptor } from './interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    // Configura el HttpClient con el interceptor y fetch
    provideHttpClient(
      withFetch(), // Usar Fetch API en lugar de XMLHttpRequest
      withInterceptors([authInterceptor]) // Registra el interceptor de autenticación
    ),
    // Asegúrate de incluir el servicio de cookies
    CookieService,
  ],
};
