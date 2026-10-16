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
      category: 'Web',
      date: '2026-11-15', 
      place: 'Tunis',
      maxParticipants: 100,
      nbParticipants: 45,
      speaker: 'Dr. Karim Bouzid',
      description: 'Découvrez les dernières avancées dans Angular 21, les Reactive Forms et les Signals.'
    },
    { 
      id: 2, 
      title: 'Java Conference', 
      category: 'Backend',
      date: '2026-11-20', 
      place: 'Sousse',
      maxParticipants: 80,
      nbParticipants: 60,
      speaker: 'Ing. Sarra Ben Amor',
      description: 'Architecture des microservices avec Spring Boot 3 et déploiement Kubernetes.'
    },
    { 
      id: 3, 
      title: 'AI Conference', 
      category: 'Intelligence Artificielle',
      date: '2026-12-05', 
      place: 'Sfax',
      maxParticipants: 150,
      nbParticipants: 90,
      speaker: 'Dr. Mehdi Trabelsi',
      description: 'Intelligence Artificielle Générative, LLMs et vision par ordinateur de pointe.'
    }
  ];

  conferences = signal<Conference[]>([...this.initialConferences]);

  getConferences(): Conference[] {
    return this.conferences();
  }

  getConferenceById(id: number): Conference | undefined {
    return this.conferences().find(c => c.id === id);
  }

  addConference(conference: Omit<Conference, 'id' | 'nbParticipants'> & { nbParticipants?: number }): void {
    const newId = this.conferences().length > 0 
      ? Math.max(...this.conferences().map(c => c.id)) + 1 
      : 1;
    const newConference: Conference = { 
      id: newId, 
      nbParticipants: conference.nbParticipants ?? 0,
      ...conference 
    };
    this.conferences.update(list => [...list, newConference]);
  }

  updateConference(updated: Conference): void {
    this.conferences.update(list => 
      list.map(c => c.id === updated.id ? updated : c)
    );
  }
}
