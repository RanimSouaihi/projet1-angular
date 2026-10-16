import { Injectable, signal } from '@angular/core';
import { Conference } from '../models/conference';

@Injectable({
  providedIn: 'root'
})
export class ConferenceService {
  private initialConferences: Conference[] = [
    { 
      id: 1, 
      title: 'Angular Conference', 
      date: '2026-10-15', 
      place: 'Tunis',
      speaker: 'Dr. Karim Bouzid',
      description: 'Découvrez les dernières avancées dans Angular 21 et les Reactive Forms.'
    },
    { 
      id: 2, 
      title: 'Java Conference', 
      date: '2026-10-20', 
      place: 'Sousse',
      speaker: 'Ing. Sarra Ben Amor',
      description: 'Architecture des microservices avec Spring Boot et Cloud.'
    },
    { 
      id: 3, 
      title: 'AI Conference', 
      date: '2026-10-25', 
      place: 'Sfax',
      speaker: 'Dr. Mehdi Trabelsi',
      description: 'Intelligence Artificielle Générative, LLMs et vision par ordinateur.'
    }
  ];

  conferences = signal<Conference[]>([...this.initialConferences]);

  getConferences(): Conference[] {
    return this.conferences();
  }

  getConferenceById(id: number): Conference | undefined {
    return this.conferences().find(c => c.id === id);
  }

  addConference(conference: Omit<Conference, 'id'>): void {
    const newId = this.conferences().length > 0 
      ? Math.max(...this.conferences().map(c => c.id)) + 1 
      : 1;
    const newConference: Conference = { id: newId, ...conference };
    this.conferences.update(list => [...list, newConference]);
  }

  updateConference(updated: Conference): void {
    this.conferences.update(list => 
      list.map(c => c.id === updated.id ? updated : c)
    );
  }
}
