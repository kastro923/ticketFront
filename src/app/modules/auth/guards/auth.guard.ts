
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard  {
  constructor(private router: Router, private authService : AuthService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let token = this.authService.getJwtToken();
    if (token && state.url != '/login') {
      return true;
    }
    else if (token && state.url == '/login') {
      this.router.navigate(['dashboard']);
      return false;
    }
    else if (!token && state.url != '/login') {
      this.router.navigate(['login']);
      return true;
    }
    return true;
  }
}
