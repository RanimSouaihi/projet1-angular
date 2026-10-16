import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConferenceService } from '../../services/conference.service';

@Component({
  selector: 'app-conference-form',
  imports: [ReactiveFormsModule],
  templateUrl: './conference-form.html',
  styleUrl: './conference-form.css'
})
export class ConferenceFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private conferenceService = inject(ConferenceService);

  conferenceForm!: FormGroup;
  isEditMode = false;
  conferenceId?: number;

  ngOnInit(): void {
    // 1. Initialisation du Reactive Form avec FormBuilder, FormGroup, FormControl et Validators
    this.conferenceForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      date: ['', [Validators.required]],
      place: ['', [Validators.required]],
      speaker: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });

    // 2. Détection du mode (Ajout ou Modification) selon l'URL
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.conferenceId = Number(idParam);
      const conf = this.conferenceService.getConferenceById(this.conferenceId);
      if (conf) {
        // Pré-remplissage du formulaire réactif avec patchValue()
        this.conferenceForm.patchValue({
          title: conf.title,
          date: conf.date,
          place: conf.place,
          speaker: conf.speaker || '',
          description: conf.description || ''
        });
      }
    }
  }

  // Getters pratiques pour accéder aux contrôles dans le template HTML
  get title() { return this.conferenceForm.get('title'); }
  get date() { return this.conferenceForm.get('date'); }
  get place() { return this.conferenceForm.get('place'); }
  get speaker() { return this.conferenceForm.get('speaker'); }
  get description() { return this.conferenceForm.get('description'); }

  onSubmit(): void {
    if (this.conferenceForm.invalid) {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.conferenceForm.markAllAsTouched();
      return;
    }

    const formValues = this.conferenceForm.value;

    if (this.isEditMode && this.conferenceId) {
      // Modification
      this.conferenceService.updateConference({
        id: this.conferenceId,
        ...formValues
      });
    } else {
      // Ajout
      this.conferenceService.addConference(formValues);
    }

    // Redirection vers la liste
    this.router.navigate(['/list']);
  }

  onCancel(): void {
    this.router.navigate(['/list']);
  }
}
