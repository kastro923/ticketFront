import { Injectable } from '@angular/core';
import { ApiHandlerService } from '../../../core/shared/utils/api-handler.service';
import { API_ENDPOINTS, ApiMethod } from '../../../core/shared/utils/const';
import {Observable, of, tap} from "rxjs";
import {catchError} from "rxjs/operators";

interface AuthResponse {
  id : number;
  email: string;
  roles: string;
  username: string;
  token:string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private isLoggedIn: boolean = false;
  private apiUrl = '/api/auth/signin';
  constructor(private http: ApiHandlerService) { }

  login(username: string, password: string): Observable<boolean> {
    const credentials = { username, password };

    return this.http.requestCall(`${this.apiUrl}`,ApiMethod.POST,null, credentials)
      .pipe(
        tap((response:AuthResponse) => {

          this.isLoggedIn = true;
          console.log(response);
          this.saveCredentials(response.token, response.email, response.roles, response.username);
        }),
        catchError(error => {
          console.error('Login failed:', error["message"]);
          this.isLoggedIn = false;
          throw error;
        })
      );
  }

  private saveCredentials(token: string, email: string, role: string, username: string): void {
    // Store the credentials in a secure way, such as using local storage or a secure cookie
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('username', username);
    localStorage.setItem("email", email);
  }

  logout(): void {
    // Clear stored credentials on logout
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    this.isLoggedIn = false;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn || localStorage.getItem("jwtToken") != null;
  }

  getJwtToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  resetPassword(data:any,token) {
    return this.http.requestCall(API_ENDPOINTS.resetPassword,ApiMethod.POST,token,data)
  }
  forgetPassword(data:any) {
    return this.http.requestCall(API_ENDPOINTS.forgetPassword,ApiMethod.POST,'',data)
  }

  signUp(data:any) {
    return this.http.requestCall(API_ENDPOINTS.signUp,ApiMethod.POST,'',data)
  }

}
