import { Injectable } from '@angular/core';
import getBrowserFingerprint from 'get-browser-fingerprint';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.authService.getJwtToken();
    if (token) {
      const clonedRequest = req.clone({
        headers: req.headers.set('Authorization', "Bearer " + token)
      });
      clonedRequest.headers.set('Content-Type', 'application/json');
      clonedRequest.headers.set("Access-Control-Allow-Origin", "*");
     return next.handle(clonedRequest);
    }

    return next.handle(req);
  }
  AddBrowserIdAndToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }


}
