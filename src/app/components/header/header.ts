import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  appName = 'ConfConnect';
  userGreeting = 'Bienvenue sur votre espace';
}
