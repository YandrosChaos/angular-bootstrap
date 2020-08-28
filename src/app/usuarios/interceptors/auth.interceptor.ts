import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service'
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

const UNAUTHORIZED_ERROR_CODE: number = 401
const FORBIDDEN_ERROR_CODE: number = 403

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError(e => {
        if (e.status == UNAUTHORIZED_ERROR_CODE) {
          if (this.authService.isAuthenticated()) {
            this.authService.logout()
          }
          this.router.navigate(['/login'])
        }

        if (e.status == FORBIDDEN_ERROR_CODE) {
          swal(
            'Acceso Denegado',
            `${this.authService.usuario.username}, no tienes acceso a este recurso`,
            'warning')
          this.router.navigate(['/clientes'])
        }
        return throwError(e);
      })
    );
  }
}
