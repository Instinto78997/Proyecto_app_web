import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  standalone: false
})
export class AlertComponent {
  @Input() message = '';
  @Input() type: 'success' | 'error' = 'success';
}
