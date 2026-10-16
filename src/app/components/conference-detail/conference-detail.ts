import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Conference } from '../../models/conference';
import { ConferenceService } from '../../services/conference.service';

@Component({
  selector: 'app-conference-detail',
  imports: [ReactiveFormsModule],
  templateUrl: './conference-detail.html',
  styleUrl: './conference-detail.css',
})
export class ConferenceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private conferenceService = inject(ConferenceService);

  conference: Conference | undefined;

  // Formulaire Réactif pour l'inscription à la conférence
  inscriptionForm!: FormGroup;
  inscriptionSuccess = false;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.conference = this.conferenceService.getConferenceById(id);
    }

    // Initialisation du formulaire réactif d'inscription
    this.inscriptionForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]]
    });
  }

  get nom() { return this.inscriptionForm.get('nom'); }
  get email() { return this.inscriptionForm.get('email'); }
  get telephone() { return this.inscriptionForm.get('telephone'); }

  onInscrire(): void {
    if (this.inscriptionForm.invalid) {
      this.inscriptionForm.markAllAsTouched();
      return;
    }
    this.inscriptionSuccess = true;
  }

  goToEdit(): void {
    if (this.conference) {
      this.router.navigate(['/edit-conference', this.conference.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/list']);
  }
}

export { ConferenceDetailComponent as ConferenceDetail };
