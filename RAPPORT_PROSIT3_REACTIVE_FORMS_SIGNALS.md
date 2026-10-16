# 🎓 Prosit 3 : ReactiveForm et Signals (Angular 21)
**École :** ESPRIT | **Module :** Framework Web (Angular 21) | **Année Universitaire :** 2026-2027

---

## 📌 1. Contexte & Problématique

### Contexte
L'application utilise désormais **Angular 21 avec les Signals**.  
Le responsable technique souhaite afficher en temps réel dans le formulaire de conférence :
1. **Le nombre de caractères saisis** pour chaque champ (titre, description).
2. **L’état de validité du formulaire** en continu.
3. **L’activation automatique du bouton « Enregistrer »** dès que le formulaire remplit toutes les contraintes.

### Problème
> Les développeurs utilisaient jusqu'ici uniquement `valueChanges` et `statusChanges` (RxJS).  
> Ils constatent que la détection des changements est **inefficace** : chaque émission déclenche des cycles de détection de changements globaux (via Zone.js), nécessite une gestion complexe de désabonnement (`unsubscribe` / `takeUntilDestroyed`) pour éviter les fuites mémoire, et alourdit le template.

---

## ⚠️ 2. Pourquoi `valueChanges` et `statusChanges` seuls sont inefficaces ?

| Inconvénient avec RxJS pur | Explication technique |
|---|---|
| **Détection de changement globale** | Chaque événement `valueChanges` déclenche une vérification de l'arbre complet des composants avec Zone.js, même si un seul petit compteur a changé. |
| **Gestion manuelle des abonnements** | Nécessite des `.subscribe()` manuels, stockant des variables intermédiaires ou multipliant les pipes `async` dans le template, avec risque avéré de fuite mémoire (*memory leak*). |
| **Sur-consommation CPU** | Le calcul du nombre de caractères ou de la validité est ré-exécuté à chaque cycle de détection, même si la valeur n'a pas varié. |
| **Effets de bord & Glitches** | Les flux RxJS asynchrones peuvent causer des incohérences transitoires (*glitches*) dans les formulaires volumineux. |

---

## ⚡ 3. La Solution Alternative : `toSignal()` et `computed()` d'Angular 21

Angular 21 introduit une passerelle officielle et optimisée entre RxJS et les Signals : **`toSignal()`** (issu de `@angular/core/rxjs-interop`).

### Avantages de l'approche Signals :
1. **Mise à jour chirurgicale du DOM :** Seul l'élément HTML précis qui lit le Signal (`{{ titleChars() }}` ou `[disabled]="!canSave()"`) est mis à jour. Aucun composant parent ou frère n'est re-vérifié.
2. **Mémoire gérée automatiquement :** `toSignal()` s'abonne et se désabonne automatiquement lors de la destruction du composant (`DestroyRef` intégré).
3. **Calculs dérivés mémorisés (*memoization*) avec `computed()` :** La valeur n'est recalculée **que** si la dépendance change, garantissant un coût d'exécution minimal.
4. **Réactivité Glitch-Free :** Garantie d'un état synchrone et cohérent à tout instant.

---

## 💻 4. Architecture de l'Implémentation dans ConfConnect

### 1. Pontage des flux du Reactive Form vers des Signals (`toSignal`)
```typescript
import { toSignal } from '@angular/core/rxjs-interop';

// A. Conversion du flux de valeur du titre en Signal
titleSignal = toSignal(this.conferenceForm.get('title')!.valueChanges, { 
  initialValue: '' 
});

// B. Conversion du flux de valeur de la description en Signal
descriptionSignal = toSignal(this.conferenceForm.get('description')!.valueChanges, { 
  initialValue: '' 
});

// C. Conversion du statut global du formulaire (VALID / INVALID) en Signal
formStatusSignal = toSignal(this.conferenceForm.statusChanges, { 
  initialValue: this.conferenceForm.status 
});

// D. Conversion des valeurs globales pour la progression
formValuesSignal = toSignal(this.conferenceForm.valueChanges, { 
  initialValue: this.conferenceForm.value 
});
```

---

### 2. Réalisation des 3 exigences du Responsable Technique avec `computed()`

#### A. Nombre de caractères saisis en temps réel :
```typescript
titleChars = computed(() => this.titleSignal()?.length ?? 0);
descriptionChars = computed(() => this.descriptionSignal()?.length ?? 0);
```

#### B. État de validité du formulaire :
```typescript
isFormValid = computed(() => this.formStatusSignal() === 'VALID');
```

#### C. Activation automatique du bouton « Enregistrer » :
```typescript
canSave = computed(() => this.isFormValid());
```

#### D. Bonus : Barre de progression en temps réel :
```typescript
formProgress = computed(() => {
  this.formValuesSignal();
  const fields = ['title', 'category', 'date', 'place', 'maxParticipants', 'speaker', 'description'];
  let validCount = 0;
  for (const f of fields) {
    const c = this.conferenceForm.get(f);
    if (c && c.valid && c.value) validCount++;
  }
  return Math.round((validCount / fields.length) * 100);
});
```

---

### 3. Exploitation simplifiée dans le Template HTML

```html
<!-- 1. Compteur de caractères réactif -->
<label>Titre de la conférence *</label>
<span class="char-counter">📊 Signal : {{ titleChars() }} / 50 car.</span>

<!-- 2. Barre de progression en temps réel -->
<div class="progress-fill" [style.width.%]="formProgress()"></div>

<!-- 3. Activation automatique du bouton Enregistrer -->
<button type="submit" class="btn-submit" [disabled]="!canSave()">
  Enregistrer la conférence
</button>
```

---

## ⚖️ 5. Tableau Comparatif : RxJS pur vs Reactive Forms + Signals

| Critère | Approche RxJS classique (`valueChanges`) | Approche Moderne (`toSignal` + `computed`) 🚀 |
|---|---|---|
| **Syntaxe dans le template** | `form.get('title')?.value?.length` ou pipe `async` | Appel direct `{{ titleChars() }}` |
| **Performances de rendu** | Vérification globale du composant (Zone.js) | Mise à jour granulaire et chirurgicale |
| **Gestion mémoire** | Risque de fuite si `unsubscribe()` omis | Désabonnement automatique et garanti |
| **Calculs dérivés** | Pipes complexes ou getters ré-exécutés en boucle | `computed()` mémorisé (*memoized* et synchrone) |
| **Compatibilité Zoneless** | Partielle | **100% prêt pour Angular Zoneless** |

---

## 🎯 6. Réponse à la Question Centrale

### *Comment combiner Reactive Forms et Signals afin de créer des formulaires Angular plus réactifs et plus performants ?*

Pour créer des formulaires hautement réactifs et performants, la meilleure pratique consiste à :
1. **Conserver le Reactive Form (`FormGroup`, `FormControl`, `Validators`) comme moteur de gestion des données et des validations métier :** Les formulaires réactifs restent incomparables pour définir les contraintes, les validateurs personnalisés et les structures complexes.
2. **Utiliser `toSignal()` comme pont réactif :** Convertir les streams observables (`form.valueChanges`, `control.valueChanges`, `form.statusChanges`) en Signals stables dès l'initialisation du composant.
3. **Utiliser `computed()` pour tous les états dérivés de l'interface :**
   - Calcul des longueurs de texte (`titleChars`).
   - Déduction immédiate de la validité (`isFormValid`).
   - Pilotage des états des boutons d'action (`canSave`).
   - Calculs de progression ou de statistiques en direct.
4. **Bénéficier de la réactivité fine-grained (à grain fin) d'Angular 21 :**  
   Grâce à cette alliance, Angular n'évalue plus l'intégralité du template à chaque frappe de clavier ; seules les balises directement connectées aux Signals sont actualisées, sans aucun lag, sans fuite mémoire et avec un code concis et lisible.
