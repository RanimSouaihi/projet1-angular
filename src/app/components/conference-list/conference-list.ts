import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConferenceService } from '../../services/conference.service';

@Component({
  selector: 'app-conference-list',
  imports: [],
  templateUrl: './conference-list.html',
  styleUrl: './conference-list.css',
})
export class ConferenceListComponent {
  private router = inject(Router);
  private conferenceService = inject(ConferenceService);

  // Liste réactive des conférences partagée via le service
  get conferences() {
    return this.conferenceService.conferences();
  }

  conferenceImage: string = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop';

  goToDetail(id: number): void {
    this.router.navigate(['/detail', id]);
  }

  editConference(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/edit-conference', id]);
  }

  goToAddConference(): void {
    this.router.navigate(['/add-conference']);
  }
}

export { ConferenceListComponent as ConferenceList };
