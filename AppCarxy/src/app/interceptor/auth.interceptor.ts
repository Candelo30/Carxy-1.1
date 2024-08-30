import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { UsuariosService } from '../service/users/usuarios.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const usuariosService = inject(UsuariosService);
  const token = usuariosService.getToken();

  console.log('Token:', token); // Verifica que el token no sea null o undefined

  if (token) {
    const authreq = req.clone({
      setHeaders: {
        Authorization: `Token ${token}`, // Asegúrate de usar el prefijo correcto
      },
    });
    return next(authreq);
  }

  return next(req);
};
