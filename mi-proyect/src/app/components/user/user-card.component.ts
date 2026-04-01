import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css'],
  standalone: false
})
export class UserCardComponent {
  @Input() username = 'Usuario';
  @Input() email = '';
}
