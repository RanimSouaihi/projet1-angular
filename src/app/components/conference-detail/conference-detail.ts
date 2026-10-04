import { Component, signal, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Conference } from '../../models/conference';

@Component({
  selector: 'app-conference-detail',
  imports: [FormsModule, DatePipe],
  templateUrl: './conference-detail.html',
  styleUrl: './conference-detail.css',
})
export class ConferenceDetail {
  // =========================================================================
  // PROSIT 4 : Communication par Entrée (@Input / Signal input) et Sortie (@Output)
  // =========================================================================
  
  // 1. Entrée (Input) : Reçoit la conférence sélectionnée depuis le composant parent/frère
  conferenceInput = input<Conference | null>(null);

  // 2. Sortie (Output) : Émet un événement vers le parent quand une inscription est effectuée
  inscriptionEvent = output<number>(); // émet l'ID de la conférence

  // Mode master-detail activé si l'input est utilisé
  isMasterDetailMode = computed(() => this.conferenceInput() !== null);

  // Données de repli pour Prosit 2 (si le composant est utilisé seul sans input)
  fallbackTitre = signal<string>('Architecture Moderne Angular 21 & Cloud');
  fallbackIntervenant = signal<string>('Dr. Amine Triki');
  fallbackDate = signal<string>('15 Novembre 2026 à 10:00');
  fallbackLieu = signal<string>('Amphi A - ESPRIT Ghazela');
  fallbackPlacesDisponibles = signal<number>(5);
  fallbackNombreInscrits = signal<number>(10);

  // Données actives courantes (soit depuis l'Input du Prosit 4, soit le fallback)
  currentTitle = computed(() => {
    const c = this.conferenceInput();
    return c ? c.title : this.fallbackTitre();
  });

  currentSpeaker = computed(() => {
    const c = this.conferenceInput();
    return c ? (c.speaker || 'Dr. Expert Conférencier') : this.fallbackIntervenant();
  });

  currentDate = computed(() => {
    const c = this.conferenceInput();
    return c ? c.date : this.fallbackDate();
  });

  currentPlace = computed(() => {
    const c = this.conferenceInput();
    return c ? c.place : this.fallbackLieu();
  });

  currentPlacesDisponibles = computed(() => {
    const c = this.conferenceInput();
    return c ? (c.maxParticipants - c.nbParticipants) : this.fallbackPlacesDisponibles();
  });

  currentNombreInscrits = computed(() => {
    const c = this.conferenceInput();
    return c ? c.nbParticipants : this.fallbackNombreInscrits();
  });

  currentDescription = computed(() => {
    const c = this.conferenceInput();
    return c ? c.description : 'Conférence spécialisée pour les étudiants et enseignants.';
  });

  // Computed Signal pour le statut
  estComplet = computed(() => this.currentPlacesDisponibles() <= 0);

  statutBadge = computed(() => {
    const places = this.currentPlacesDisponibles();
    if (places <= 0) return { texte: 'COMPLET', classe: 'badge-danger' };
    if (places <= 3) return { texte: 'DERNIÈRES PLACES', classe: 'badge-warning' };
    return { texte: 'INSCRIPTIONS OUVERTES', classe: 'badge-success' };
  });

  // Message dynamique d'alerte
  messageConfirmation = signal<string>('');

  // Inscription
  inscrire() {
    if (this.currentPlacesDisponibles() > 0) {
      const c = this.conferenceInput();
      if (c) {
        // En mode Prosit 4 : Notifie le parent via l'Output
        this.inscriptionEvent.emit(c.id);
        this.messageConfirmation.set(`Félicitations ! Vous êtes inscrit(e) à "${c.title}".`);
      } else {
        // En mode Prosit 2 autonome
        this.fallbackPlacesDisponibles.update(p => p - 1);
        this.fallbackNombreInscrits.update(i => i + 1);
        this.messageConfirmation.set('Félicitations ! Inscription enregistrée avec succès.');
      }
    }
  }

  annulerInscription() {
    if (this.currentNombreInscrits() > 0 && !this.conferenceInput()) {
      this.fallbackPlacesDisponibles.update(p => p + 1);
      this.fallbackNombreInscrits.update(i => i - 1);
      this.messageConfirmation.set('Votre désistement a été pris en compte.');
    }
  }

  // Two-way binding pour Prosit 2
  modifierTitre(event: Event) {
    const input = event.target as HTMLInputElement;
    this.fallbackTitre.set(input.value);
  }
}
