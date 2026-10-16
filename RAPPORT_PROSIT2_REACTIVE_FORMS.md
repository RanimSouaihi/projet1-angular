# 🎓 Prosit 2 : Construire un Formulaire Valide avec ReactiveForm (Angular 21)
**École :** ESPRIT | **Module :** Framework Web (Angular 21) | **Année Universitaire :** 2026-2027

---

## 📌 1. Contexte & Problématique

### Contexte
L’application permet maintenant aux utilisateurs d’ajouter une conférence.  
Chaque conférence possède :
- Un titre (`title`)
- Une description (`description`)
- Une catégorie (`category`)
- Un lieu (`place`)
- Une date (`date`)
- Un nombre maximal de participants (`maxParticipants`)
- Le nombre de participants inscrits (`nbParticipants`)
- Un conférencier (`speaker`)

### Problème
> Les développeurs souhaitent créer un formulaire contenant plusieurs champs liés entre eux.  
> Ils ne savent pas comment organiser les différents contrôles et appliquer les contraintes logiques pour que les données saisies soient fiables et vérifiées avant d'être envoyées.

---

## 📋 2. Identification des Champs & Contraintes Logiques

Pour garantir que les données sont valides et cohérentes avec la réalité métier, les contraintes suivantes ont été définies :

| Champ | Type HTML | Contrôle Angular | Contraintes Logiques & Validateurs | Règle Métier |
|---|---|---|---|---|
| **`title`** | `text` | `FormControl` | `Validators.required`, `Validators.minLength(3)`, `Validators.maxLength(50)`, `validTitleValidator()` | Le titre est obligatoire, sans espaces vides au début, entre 3 et 50 caractères. |
| **`category`** | `select` | `FormControl` | `Validators.required` | Choix obligatoire parmi une liste prédéfinie (Web, Backend, AI, Cloud, Cybersécurité). |
| **`date`** | `date` | `FormControl` | `Validators.required`, `futureDateValidator()` (Custom Validator) | **Contrainte logique :** Une conférence ne peut pas être planifiée dans le passé. |
| **`place`** | `text` | `FormControl` | `Validators.required`, `Validators.minLength(2)` | Le lieu doit comporter au moins 2 caractères. |
| **`maxParticipants`**| `number` | `FormControl` | `Validators.required`, `Validators.min(10)`, `Validators.max(500)` | Doit être compris entre 10 et 500 places. |
| **`speaker`** | `text` | `FormControl` | `Validators.required`, `Validators.minLength(3)` | Le nom du conférencier est obligatoire. |
| **`description`** | `textarea` | `FormControl` | `Validators.required`, `Validators.minLength(10)`, `Validators.maxLength(300)` | Explication claire d'au moins 10 caractères. |

---

## 🧱 3. Structure du Formulaire & Rôle des Éléments Angular

### 1. `FormControl`
- **Rôle :** Représente l'unité élémentaire du formulaire. Il encapsule la valeur du champ, son statut de validité (`VALID`, `INVALID`, `PENDING`), ainsi que son historique d'interaction (`touched`, `untouched`, `dirty`, `pristine`).
- **Exemple :**
  ```typescript
  title: new FormControl('', [Validators.required, Validators.minLength(3)])
  ```

### 2. `FormGroup`
- **Rôle :** Représente l'ensemble du formulaire sous forme d'arborescence. Il agrège les valeurs et statuts de chaque `FormControl`. Le `FormGroup` n'est valide que si **tous** ses contrôles enfants sont valides.
- **Exemple :**
  ```typescript
  this.conferenceForm = this.fb.group({ ... });
  ```

### 3. `FormBuilder`
- **Rôle :** Service injectable d'Angular qui fournit des méthodes pratiques (`group()`, `control()`, `array()`) pour instancier des formulaires réactifs sans répéter la syntaxe `new FormControl()`.

### 4. `Validators` et Validateurs Personnalisés
- **Rôle :** Fonctions pures TypeScript exécutées de manière synchrone à chaque modification de valeur.
- **Validateur Personnalisé `futureDateValidator()` :**
  ```typescript
  export function futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const selected = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected < today ? { pastDate: { message: 'La date doit être future.' } } : null;
    };
  }
  ```

---

## ⚠️ 4. Gestion des Messages d'Erreur dans le Template

Angular permet de conditionner l'affichage des erreurs uniquement lorsque l'utilisateur a interagi avec le champ (`touched`) et que le contrôle est invalide (`invalid`) :

```html
<input formControlName="title" [class.input-error]="title?.touched && title?.invalid" />

@if (title?.touched && title?.invalid) {
  <div class="error-msg">
    @if (title?.errors?.['required']) { <span>⚠️ Le titre est obligatoire.</span> }
    @if (title?.errors?.['minlength']) { <span>⚠️ Minimum 3 caractères requis.</span> }
    @if (title?.errors?.['maxlength']) { <span>⚠️ Maximum 50 caractères autorisés.</span> }
    @if (title?.errors?.['invalidTitle']) { <span>⚠️ {{ title?.errors?.['invalidTitle'].message }}</span> }
  </div>
}
```

---

## 📥 5. Récupération des Données en TypeScript

Lors du clic sur le bouton de soumission (`ngSubmit`), la méthode `onSubmit()` vérifie la validité globale du formulaire avant de traiter les données :

```typescript
onSubmit(): void {
  // 1. Si le formulaire contient la moindre erreur, marquer tous les champs
  if (this.conferenceForm.invalid) {
    this.conferenceForm.markAllAsTouched();
    return;
  }

  // 2. Récupération directe des valeurs sous forme d'objet typé
  const data = this.conferenceForm.value;
  console.log('Données soumises :', data);

  // 3. Transmission au service partagé
  this.conferenceService.addConference({ ...data, nbParticipants: 0 });
  this.router.navigate(['/list']);
}
```

---

## 🎯 6. Réponses aux Questions Centrales

### Question 1 : *Comment construire un formulaire Angular à l'aide de FormControl et FormGroup ?*
1. **Importation :** Importer `ReactiveFormsModule` dans le composant standalone (ou le module).
2. **Déclaration du modèle en TypeScript :** Créer une instance de `FormGroup` (via `new FormGroup()` ou `FormBuilder.group()`) contenant une clé pour chaque champ, associée à un `FormControl`.
3. **Liaison dans le Template HTML :** 
   - Lier la balise `<form>` au groupe via la directive `[formGroup]="conferenceForm"`.
   - Lier chaque `<input>`, `<select>` ou `<textarea>` à son contrôle respectif via `formControlName="nomDuChamp"`.
4. **Gestion de la soumission :** Utiliser `(ngSubmit)="onSubmit()"` pour intercepter l'envoi et exploiter `this.conferenceForm.value`.

---

### Question 2 : *Comment Angular permet-il de valider les données d'un Reactive Form avant leur envoi ?*
1. **Attachement des validateurs côté TypeScript :** Les contraintes (`Validators.required`, `Validators.min`, validateurs personnalisés) sont associées directement lors de la création du `FormControl`.
2. **Évaluation synchrone en temps réel :** À chaque frappe de l'utilisateur, Angular réévalue immédiatement les fonctions de validation. Si une contrainte échoue, elle peuple la propriété `control.errors` (ex: `{ required: true }`) et passe `control.status` à `'INVALID'`.
3. **Propagation ascendante :** Le `FormGroup` parent agrège l'état de tous ses enfants. Si au moins un champ est invalide, `form.invalid` vaut `true` et `form.valid` vaut `false`.
4. **Verrouillage de la soumission :**
   - **Côté Template :** Désactivation du bouton avec `[disabled]="conferenceForm.invalid"`.
   - **Côté TypeScript :** Garde de sécurité dans `onSubmit()` :
     ```typescript
     if (this.conferenceForm.invalid) {
       this.conferenceForm.markAllAsTouched();
       return; // Bloque tout envoi ou appel API
     }
     ```
   Cela garantit qu'aucune donnée incorrecte ne peut être transmise au backend.
