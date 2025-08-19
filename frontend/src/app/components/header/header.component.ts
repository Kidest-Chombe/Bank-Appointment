import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  bankName = 'Development Bank of Ethiopia';
  tagline = 'Your Development Partner!';
  navItems = [
    { path: '/', label: 'Home' },
    { path: '/book', label: 'Book Appointment' },
    { path: '/appointments', label: 'My Appointments' }
  ];
}
