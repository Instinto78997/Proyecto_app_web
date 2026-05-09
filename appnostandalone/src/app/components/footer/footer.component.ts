import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FooterService, FooterData } from '../../services/footer.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  footerData!: FooterData;
  currentYear: number = new Date().getFullYear();

  constructor(
    private footerService: FooterService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.footerService.footerData$.subscribe(data => {
      this.footerData = {
        ...data,
        year: this.currentYear
      };
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}