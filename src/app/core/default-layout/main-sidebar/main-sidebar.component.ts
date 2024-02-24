import { Component, OnInit } from '@angular/core';
import {adminItems, navItems, techItems, userItems} from '../_nav';
import {AuthService} from "../../../modules/auth/services/auth.service";

@Component({
  selector: 'app-main-sidebar',
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.css']
})
export class MainSidebarComponent implements OnInit {
  public navItems = navItems;
  username:string="";


  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    let role = this.authService.getUserRole()??"ADMIN";
    this.username = this.authService.getUsername();
    switch (role) {
      case 'ADMIN':
        this.navItems = adminItems;
        break;
      case 'TECHNICIEN':
        this.navItems = techItems;
        break;
      case 'EMPLOYEE':
        this.navItems = userItems;
        break;
    }
  }

}
