import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  navItems = [
    { label: 'Accueil', icon: '🏠', active: false },
    { label: 'Mes Conférences', icon: '📅', active: false },
    { label: 'Profil Utilisateur', icon: '👤', active: true },
    { label: 'Réseau & Speakers', icon: '🤝', active: false },
    { label: 'Paramètres', icon: '⚙️', active: false }
  ];
}
