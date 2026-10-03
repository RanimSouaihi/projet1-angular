import { Component } from '@angular/core';

interface AppNotification {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: string;
  unread: boolean;
}

@Component({
  selector: 'app-notifications',
  imports: [],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications {
  notifications: AppNotification[] = [
    {
      id: 1,
      title: 'Proposition acceptée 🎉',
      description: 'Votre talk "Angular 21 Architecture" a été validé pour le DevFest 2026.',
      time: 'Il y a 10 min',
      icon: '✅',
      unread: true
    },
    {
      id: 2,
      title: 'Nouveau message de groupe',
      description: 'Sarra Mansour a partagé les slides du panel Cloud & Edge.',
      time: 'Il y a 1 heure',
      icon: '📩',
      unread: true
    },
    {
      id: 3,
      title: 'Rappel de conférence ⏰',
      description: 'L’événement "Web Summit Tunis" démarre demain à 09:30.',
      time: 'Il y a 3 heures',
      icon: '🔔',
      unread: false
    }
  ];

  markAllAsRead() {
    this.notifications.forEach(n => n.unread = false);
  }
}
