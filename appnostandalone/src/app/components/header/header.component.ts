import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService, MenuItem } from '../../services/header.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menuItems: MenuItem[] = [];
  isLoggedIn: boolean = false;
  userName: string = '';

  constructor(
    private headerService: HeaderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.headerService.menuItems$.subscribe(items => {
      this.menuItems = items;
    });
    
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.authService.getCurrentUser();
      this.userName = user?.nombre || user?.username || '';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}