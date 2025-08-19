import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls:[ './home.component.css']
})
export class HomeComponent {
welcomeMessage = 'Welcome to Development Bank of Ethiopia';
}
