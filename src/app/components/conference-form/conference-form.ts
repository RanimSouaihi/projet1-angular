import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConferenceService } from '../../services/conference.service';
import { futureDateValidator, validTitleValidator } from '../../validators/custom-validators';

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

  // Catégories disponibles pour les conférences
  categories: string[] = [
    'Web',
    'Backend',
    'Intelligence Artificielle',
    'Cloud & DevOps',
    'Cybersécurité',
    'Mobile'
  ];

  // =========================================================================
  // PROSIT 2 : Construction du formulaire à l'aide de FormGroup et FormControl
  // =========================================================================
  conferenceForm!: FormGroup;
  isEditMode = false;
  conferenceId?: number;

  ngOnInit(): void {
    // Construction explicite avec FormBuilder et définition des contraintes logiques
    this.conferenceForm = this.fb.group({
      // 1. Titre : obligatoire, min 3 car., max 50 car., titre valide
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        validTitleValidator()
      ]),

      // 2. Catégorie : obligatoire
      category: new FormControl('', [
        Validators.required
      ]),

      // 3. Date : obligatoire + contrainte logique de date future
      date: new FormControl('', [
        Validators.required,
        futureDateValidator()
      ]),

      // 4. Lieu : obligatoire, min 2 caractères
      place: new FormControl('', [
        Validators.required,
        Validators.minLength(2)
      ]),

      // 5. Nombre maximal de participants : obligatoire, min 10, max 500
      maxParticipants: new FormControl(50, [
        Validators.required,
        Validators.min(10),
        Validators.max(500)
      ]),

      // 6. Conférencier / Speaker : obligatoire
      speaker: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),

      // 7. Description : obligatoire, min 10 caractères
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(300)
      ])
    });

    // Détection du mode (Ajout ou Modification)
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.conferenceId = Number(idParam);
      const conf = this.conferenceService.getConferenceById(this.conferenceId);
      if (conf) {
        // Récupération et injection des données dans le formulaire
        this.conferenceForm.patchValue({
          title: conf.title,
          category: conf.category,
          date: conf.date,
          place: conf.place,
          maxParticipants: conf.maxParticipants,
          speaker: conf.speaker || '',
          description: conf.description || ''
        });
      }
    }
  }

  // =========================================================================
  // Getters pour faciliter l'accès aux contrôles dans le template HTML
  // =========================================================================
  get title() { return this.conferenceForm.get('title'); }
  get category() { return this.conferenceForm.get('category'); }
  get date() { return this.conferenceForm.get('date'); }
  get place() { return this.conferenceForm.get('place'); }
  get maxParticipants() { return this.conferenceForm.get('maxParticipants'); }
  get speaker() { return this.conferenceForm.get('speaker'); }
  get description() { return this.conferenceForm.get('description'); }

  // Soumission et récupération des données en TypeScript
  onSubmit(): void {
    if (this.conferenceForm.invalid) {
      // Marquer tous les contrôles comme touchés pour afficher les messages d'erreur
      this.conferenceForm.markAllAsTouched();
      return;
    }

    // Récupération des valeurs du formulaire typées depuis TypeScript
    const formValues = this.conferenceForm.value;
    console.log('Données récupérées depuis le Reactive Form :', formValues);

    if (this.isEditMode && this.conferenceId) {
      const existing = this.conferenceService.getConferenceById(this.conferenceId);
      this.conferenceService.updateConference({
        id: this.conferenceId,
        nbParticipants: existing?.nbParticipants ?? 0,
        ...formValues
      });
    } else {
      this.conferenceService.addConference({
        ...formValues,
        nbParticipants: 0
      });
    }

    // Redirection vers la liste des conférences
    this.router.navigate(['/list']);
  }

  onReset(): void {
    this.conferenceForm.reset({
      category: '',
      maxParticipants: 50
    });
  }

  onCancel(): void {
    this.router.navigate(['/list']);
  }
}
