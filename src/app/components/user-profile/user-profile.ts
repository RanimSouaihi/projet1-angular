import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile {
  user = {
    name: 'Ahmed Trad',
    title: 'Ingénieur Logiciel & Conférencier Tech',
    organization: 'ESPRIT Tech Labs',
    email: 'ahmed.trad@esprit.tn',
    bio: 'Passionné par l’architecture logicielle, les frameworks modernes comme Angular et l’intelligence artificielle. Intervenant régulier sur les conférences internationales.',
    conferencesCount: 14,
    followersCount: 1250,
    friendsCount: 380,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed'
  };
}
