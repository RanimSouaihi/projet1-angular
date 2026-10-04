import { Component, signal, computed } from '@angular/core';
import { UpperCasePipe, DatePipe, NgClass } from '@angular/common';
import { Conference } from '../../models/conference';

@Component({
  selector: 'app-conference-list',
  imports: [UpperCasePipe, DatePipe, NgClass],
  templateUrl: './conference-list.html',
  styleUrl: './conference-list.css',
})
export class ConferenceList {
  // Date de référence actuelle
  currentDate = new Date();

  // Liste initiale des conférences (avec des conférences futures et passées pour tester le filtrage)
  private initialConferences: Conference[] = [
    {
      id: 1,
      title: 'Intelligence Artificielle Générative & LLMs',
      description: 'Découvrez les dernières avancées dans les modèles multimodaux et agents intelligents.',
      date: new Date(2026, 10, 15, 10, 0), // Novembre 2026 (Futur)
      place: 'Amphithéâtre IBN KHALDOUN - ESPRIT',
      maxParticipants: 100,
      nbParticipants: 75, // Reste 25 places -> Bouton VERT
    },
    {
      id: 2,
      title: 'Architecture Micro-Frontends avec Angular 21',
      description: 'Concevoir des applications modulaires à grande échelle avec les signaux et standalone components.',
      date: new Date(2026, 10, 22, 14, 30), // Novembre 2026 (Futur)
      place: 'Salle Polyvalente - Bloc B',
      maxParticipants: 50,
      nbParticipants: 45, // Reste 5 places (< 10) -> Bouton ORANGÉ
    },
    {
      id: 3,
      title: 'DevOps & Sécurité dans le Cloud AWS/Azure',
      description: 'Atelier pratique sur les pipelines CI/CD sécurisés et le déploiement continu.',
      date: new Date(2026, 11, 5, 9, 30), // Décembre 2026 (Futur)
      place: 'Lab Cloud Computing - Bloc C',
      maxParticipants: 30,
      nbParticipants: 30, // Reste 0 place -> Bouton ROUGE (Complet)
    },
    {
      id: 4,
      title: 'Introduction au Framework Symfony 7',
      description: 'Session d’initiation aux concepts MVC et services Symfony.',
      date: new Date(2025, 2, 10, 11, 0), // Passée -> Ne doit pas s'afficher
      place: 'Salle 204 - ESPRIT Ghazela',
      maxParticipants: 40,
      nbParticipants: 38,
    },
    {
      id: 5,
      title: 'Cybersécurité : Défense et Analyse Forensique',
      description: 'Méthodologies d’investigation numérique et protection contre les cyberattaques modernes.',
      date: new Date(2026, 11, 18, 15, 0), // Décembre 2026 (Futur)
      place: 'Auditorium Central - ESPRIT',
      maxParticipants: 80,
      nbParticipants: 62, // Reste 18 places -> Bouton VERT
    }
  ];

  // Signal contenant la liste des conférences
  conferences = signal<Conference[]>([...this.initialConferences]);

  // Option pour masquer ou afficher les conférences passées
  masquerAnciennes = signal<boolean>(true);

  // Computed Signal : filtre automatiquement pour ne garder que les conférences futures (date >= aujourd'hui)
  conferencesFiltrees = computed(() => {
    const list = this.conferences();
    if (!this.masquerAnciennes()) {
      return list;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return list.filter(conf => new Date(conf.date) >= today);
  });

  // Calcul du nombre de places restantes
  getPlacesRestantes(conf: Conference): number {
    return conf.maxParticipants - conf.nbParticipants;
  }

  // Règle de style dynamique exigée par le Prosit 3 :
  // - >= 10 places restantes : Vert
  // - < 10 places restantes : Orangé
  // - 0 place restante : Rouge
  getButtonClass(conf: Conference): string {
    const restantes = this.getPlacesRestantes(conf);
    if (restantes <= 0) {
      return 'btn-status-red';
    } else if (restantes < 10) {
      return 'btn-status-orange';
    } else {
      return 'btn-status-green';
    }
  }

  // Inscription interactive pour voir le bouton changer de couleur en direct
  inscrire(conf: Conference) {
    if (this.getPlacesRestantes(conf) > 0) {
      this.conferences.update(list =>
        list.map(c => c.id === conf.id ? { ...c, nbParticipants: c.nbParticipants + 1 } : c)
      );
    }
  }

  // Simuler une liste vide pour tester le message "Aucune conférence enregistrée"
  viderListe() {
    this.conferences.set([]);
  }

  // Recharger la liste initiale
  rechargerListe() {
    this.conferences.set([...this.initialConferences]);
  }

  // Basculer l'affichage des anciennes conférences
  toggleAnciennes() {
    this.masquerAnciennes.update(val => !val);
  }
}
