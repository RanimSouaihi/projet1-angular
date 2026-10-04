import { Component, signal } from '@angular/core';
import { Header } from './components/header/header';
import { Navbar } from './components/navbar/navbar';
import { UserProfile } from './components/user-profile/user-profile';
import { FriendsList } from './components/friends-list/friends-list';
import { Notifications } from './components/notifications/notifications';
import { Footer } from './components/footer/footer';
import { ConferenceDetail } from './components/conference-detail/conference-detail';
import { ConferenceList } from './components/conference-list/conference-list';
import { Conference } from './models/conference';

@Component({
  selector: 'app-root',
  imports: [
    Header,
    Navbar,
    UserProfile,
    FriendsList,
    Notifications,
    Footer,
    ConferenceDetail,
    ConferenceList
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'ConfConnect - Plateforme Conférences ESPRIT';
  
  // Signal réactif pour basculer facilement entre les 4 Prosits ESPRIT
  activeProsit = signal<'prosit4' | 'prosit3' | 'prosit2' | 'prosit1'>('prosit4');

  // =========================================================================
  // PROSIT 4 : État partagé pour la communication entre ConferenceList et ConferenceDetail
  // =========================================================================
  selectedConference = signal<Conference | null>(null);

  setProsit(prosit: 'prosit1' | 'prosit2' | 'prosit3' | 'prosit4') {
    this.activeProsit.set(prosit);
  }

  // Réception de la conférence sélectionnée depuis ConferenceList (via Output)
  onConferenceSelected(conf: Conference) {
    this.selectedConference.set(conf);
  }

  // Réception de l'événement d'inscription depuis ConferenceDetail (via Output)
  onInscriptionFromDetail(confId: number, confList: ConferenceList) {
    confList.incrementParticipants(confId);
    const current = this.selectedConference();
    if (current && current.id === confId && (current.maxParticipants - current.nbParticipants > 0)) {
      this.selectedConference.set({
        ...current,
        nbParticipants: current.nbParticipants + 1
      });
    }
  }
}
