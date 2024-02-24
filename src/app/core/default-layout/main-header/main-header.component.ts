import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../modules/auth/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  handleLogout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
