import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from '../services/auth.service'
import { navItems } from 'src/app/core/default-layout/_nav';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public navItems = navItems;
  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  });
  error: string = "";
  isLoading: boolean = false;
  constructor(private authService:AuthService, private router: Router) {
    this.loginForm.valueChanges.subscribe((changes:any)=>{
      this.isLoading = false;
      this.error = "";
    })
  }


  onSingIn(){
    if (!this.loginForm.invalid) {
      this.isLoading = true;

      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      this.authService.login(email, password)
        .subscribe({
          next: (result: boolean) => {
            if (result) {
              this.router.navigate(['/dashboard']);
            }
            this.isLoading = false;
            this.error = "an error occured";
          },
          error: (error) => {
            this.isLoading = false;
            console.log(error["message"]);
            this.error = error["message"];
          }
        });
    } else {
      this.validateEmail();
      this.validatePassword();
    }

  }

  validateEmail() {
    const control = this.loginForm.controls.email;
    if (control !== null && control.invalid) {
      this.error = "Verify Email";
      this.isLoading = true;
    }
  }

  validatePassword() {
    const control = this.loginForm.controls.password;
    if (control !== null && control.invalid) {
      this.error = "Verify Password";
      this.isLoading = true;
    }
  }
  moveToForgetPassword(){
    this.router.navigate(['reset-password']);
  }
}
