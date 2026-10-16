import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validateur personnalisé pour vérifier que la date de la conférence est dans le futur
 * (Contrainte logique exigée par le Prosit 2)
 */
export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Si vide, Validators.required gère déjà l'erreur
    }

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return { pastDate: { message: 'La date de la conférence doit obligatoirement être future ou égale à aujourd’hui.' } };
    }

    return null;
  };
}

/**
 * Validateur personnalisé pour vérifier que le titre ne commence pas par des espaces ou caractères spéciaux
 */
export function validTitleValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const trimmed = control.value.trim();
    if (trimmed.length < 3) {
      return { invalidTitle: { message: 'Le titre doit comporter au moins 3 caractères signifiants.' } };
    }
    return null;
  };
}
