import { Component } from '@angular/core';

interface Friend {
  id: number;
  name: string;
  role: string;
  avatarColor: string;
  isOnline: boolean;
}

@Component({
  selector: 'app-friends-list',
  imports: [],
  templateUrl: './friends-list.html',
  styleUrl: './friends-list.css',
})
export class FriendsList {
  friends: Friend[] = [
    { id: 1, name: 'Sarra Mansour', role: 'Architecte Cloud', avatarColor: '#3b82f6', isOnline: true },
    { id: 2, name: 'Karim Jaziri', role: 'Dev Lead Angular', avatarColor: '#10b981', isOnline: true },
    { id: 3, name: 'Yasmine Gharbi', role: 'UX/UI Designer', avatarColor: '#f59e0b', isOnline: false },
    { id: 4, name: 'Omar Riahi', role: 'DevOps Engineer', avatarColor: '#8b5cf6', isOnline: true },
    { id: 5, name: 'Nour Ben Salem', role: 'Data Scientist', avatarColor: '#ec4899', isOnline: false }
  ];
}
