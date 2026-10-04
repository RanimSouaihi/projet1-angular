import { Component, signal } from '@angular/core';
import { Header } from './components/header/header';
import { Navbar } from './components/navbar/navbar';
import { UserProfile } from './components/user-profile/user-profile';
import { FriendsList } from './components/friends-list/friends-list';
import { Notifications } from './components/notifications/notifications';
import { Footer } from './components/footer/footer';
import { ConferenceDetail } from './components/conference-detail/conference-detail';
import { ConferenceList } from './components/conference-list/conference-list';

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
  
  // Signal réactif pour basculer facilement entre les 3 Prosits ESPRIT
  activeProsit = signal<'prosit3' | 'prosit2' | 'prosit1'>('prosit3');

  setProsit(prosit: 'prosit1' | 'prosit2' | 'prosit3') {
    this.activeProsit.set(prosit);
  }
}
