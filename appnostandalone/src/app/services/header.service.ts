import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface MenuItem {
  label: string;
  route: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private menuItemsSubject = new BehaviorSubject<MenuItem[]>([
    { label: 'Inicio', route: '/dashboard/inicio'},
    { label: 'Ventas', route: '/dashboard/ventas'},
    { label: 'Compras', route: '/dashboard/compras'},
    { label: 'Inventario', route: '/dashboard/inventario'},
    { label: 'Perfil', route: '/dashboard/perfil',}
  ]);

  menuItems$ = this.menuItemsSubject.asObservable();

  setMenuItems(items: MenuItem[]): void {
    this.menuItemsSubject.next(items);
  }

  addMenuItem(item: MenuItem): void {
    const current = this.menuItemsSubject.value;
    this.menuItemsSubject.next([...current, item]);
  }
}