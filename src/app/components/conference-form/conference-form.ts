import { Component, OnInit, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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

  // Catégories disponibles
  categories: string[] = [
    'Web',
    'Backend',
    'Intelligence Artificielle',
    'Cloud & DevOps',
    'Cybersécurité',
    'Mobile'
  ];

  // 1. Définition du Reactive Form dans le contexte d'injection
  conferenceForm: FormGroup = this.fb.group({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      validTitleValidator()
    ]),
    category: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required, futureDateValidator()]),
    place: new FormControl('', [Validators.required, Validators.minLength(2)]),
    maxParticipants: new FormControl(50, [
      Validators.required,
      Validators.min(10),
      Validators.max(500)
    ]),
    speaker: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(300)
    ])
  });

  // =========================================================================
  // PROSIT 3 : REACTIVE FORMS & SIGNALS (Solution alternative ultra-performante)
  // Utilisation de toSignal() pour convertir les flux RxJS en Signals Angular 21
  // =========================================================================

  // A. Ponts vers les signaux pour les contrôles spécifiques
  titleSignal = toSignal(this.conferenceForm.get('title')!.valueChanges, { 
    initialValue: this.conferenceForm.get('title')?.value ?? '' 
  });

  descriptionSignal = toSignal(this.conferenceForm.get('description')!.valueChanges, { 
    initialValue: this.conferenceForm.get('description')?.value ?? '' 
  });

  // B. Signal d'état global du formulaire
  formStatusSignal = toSignal(this.conferenceForm.statusChanges, { 
    initialValue: this.conferenceForm.status 
  });

  // C. Signal des valeurs globales du formulaire
  formValuesSignal = toSignal(this.conferenceForm.valueChanges, { 
    initialValue: this.conferenceForm.value 
  });

  // =========================================================================
  // CALCULS DÉRIVÉS RÉACTIFS (computed)
  // =========================================================================

  // 1. Nombre de caractères saisis en temps réel (pour Titre et Description)
  titleChars = computed(() => this.titleSignal()?.length ?? 0);
  descriptionChars = computed(() => this.descriptionSignal()?.length ?? 0);

  // 2. État de validité du formulaire sous forme de Signal booléen
  isFormValid = computed(() => this.formStatusSignal() === 'VALID');

  // 3. Activation automatique du bouton « Enregistrer » via Signal
  canSave = computed(() => this.isFormValid());

  // 4. Progression dynamique du formulaire (%)
  formProgress = computed(() => {
    // Déclencheur réactif via le signal des valeurs
    this.formValuesSignal();
    const fields = ['title', 'category', 'date', 'place', 'maxParticipants', 'speaker', 'description'];
    let validCount = 0;
    for (const f of fields) {
      const c = this.conferenceForm.get(f);
      if (c && c.valid && c.value !== '' && c.value !== null) {
        validCount++;
      }
    }
    return Math.round((validCount / fields.length) * 100);
  });

  isEditMode = false;
  conferenceId?: number;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.conferenceId = Number(idParam);
      const conf = this.conferenceService.getConferenceById(this.conferenceId);
      if (conf) {
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

  // Getters pour les contrôles du template
  get title() { return this.conferenceForm.get('title'); }
  get category() { return this.conferenceForm.get('category'); }
  get date() { return this.conferenceForm.get('date'); }
  get place() { return this.conferenceForm.get('place'); }
  get maxParticipants() { return this.conferenceForm.get('maxParticipants'); }
  get speaker() { return this.conferenceForm.get('speaker'); }
  get description() { return this.conferenceForm.get('description'); }

  onSubmit(): void {
    if (!this.canSave()) {
      this.conferenceForm.markAllAsTouched();
      return;
    }

    const formValues = this.conferenceForm.value;

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
