import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface FooterLink {
  label: string;
  url: string;
  icon?: string;
}

export interface FooterData {
  companyName: string;
  year: number;
  links: FooterLink[];
  socialLinks: FooterLink[];
  email: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class FooterService {
  private footerDataSubject = new BehaviorSubject<FooterData>({
    companyName: 'Mi Proyecto',
    year: new Date().getFullYear(),
    links: [],
    socialLinks: [],
    email: '',
    phone: ''
  });

  footerData$ = this.footerDataSubject.asObservable();

  setFooterData(data: FooterData): void {
    this.footerDataSubject.next(data);
  }
}