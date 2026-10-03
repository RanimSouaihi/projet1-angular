import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-conference-detail',
  imports: [FormsModule],
  templateUrl: './conference-detail.html',
  styleUrl: './conference-detail.css',
})
export class ConferenceDetail {
  // 1. Déclaration des données réactives sous forme de Signals (Angular 21)
  titre = signal<string>('Architecture Moderne Angular 21 & Cloud');
  intervenant = signal<string>('Dr. Amine Triki');
  date = signal<string>('15 Novembre 2026 à 10:00');
  lieu = signal<string>('Amphi A - ESPRIT Ghazela');
  placesInitiales = 15;
  placesDisponibles = signal<number>(5);
  nombreInscrits = signal<number>(10);

  // 2. Computed Signal : Valeur calculée automatiquement dès qu'un signal change
  estComplet = computed(() => this.placesDisponibles() <= 0);

  statutBadge = computed(() => {
    if (this.placesDisponibles() <= 0) return { texte: 'COMPLET', classe: 'badge-danger' };
    if (this.placesDisponibles() <= 3) return { texte: 'DERNIÈRES PLACES', classe: 'badge-warning' };
    return { texte: 'INSCRIPTIONS OUVERTES', classe: 'badge-success' };
  });

  // Message dynamique d'alerte
  messageConfirmation = signal<string>('');

  // 3. Gestion des événements (Event Binding)
  inscrire() {
    if (this.placesDisponibles() > 0) {
      this.placesDisponibles.update(places => places - 1);
      this.nombreInscrits.update(inscrits => inscrits + 1);
      this.messageConfirmation.set('Félicitations ! Votre inscription a été enregistrée avec succès.');
    }
  }

  annulerInscription() {
    if (this.nombreInscrits() > 0) {
      this.placesDisponibles.update(places => places + 1);
      this.nombreInscrits.update(inscrits => inscrits - 1);
      this.messageConfirmation.set('Votre désistement a été pris en compte.');
    }
  }

  // Two-way binding alternatif via méthode event (Event Binding)
  modifierTitre(event: Event) {
    const input = event.target as HTMLInputElement;
    this.titre.set(input.value);
  }
}
