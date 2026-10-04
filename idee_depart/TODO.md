# TODO — Fée

Plan de développement du jeu décrit dans `AGENTS.md`.
Document vivant : on coche au fur et à mesure.

**Principe de simplicité** : la forêt elle-même est l'unique interface de suivi.
En lançant le jeu on voit tout d'un coup d'œil, et on tape un élément pour agir.
Pas de menu de progression.

---

## Décisions figées

- **Langage** : TypeScript.
- **Moteur** : Phaser 3.
- **Build / dev** : Vite.
- **Hébergement** : GitHub Pages (via GitHub Actions).
- **Cible** : iPad, portrait, Safari, installé sur l'écran d'accueil (mode PWA).
- **Bilan du soir** : saisi **par la fille**, sans validation parentale.
- **Emplacements** : **fixes** — chaque élément a sa place réservée dans le décor ;
  taper un emplacement vide permet de le planter (1 ⭐).
- **Une seule joueuse**, un seul appareil → sauvegarde locale (`localStorage`).
- **Départ** : la partie commence avec **la Cabane de la fée niveau 1, et rien d'autre**.
- **Déblocage** : les autres éléments s'**achètent pour 1 ⭐** et apparaissent niveau 1.
- **Irréversibilité douce** : un élément créé **ne disparaît jamais** (minimum niveau 1).
- **Affichage du niveau** : on montre **« Niveau X »** (en plus du visuel).
- **Évolution visuelle** : **5 paliers** par élément, répartis sur les 50 niveaux.

## Direction artistique

- **Style** : conte de fées, vectoriel / flat, formes arrondies, contours doux.
- **V1 (MVP)** : graphismes **dessinés au code** (Phaser Graphics) + icônes,
  pour prototyper vite. Assets libres CC0 plus tard, sans changer la structure.
- **Palette** (centralisée dans `theme.ts`) : fée = vert tendre, rose, doré ;
  sorcière = violet sombre, vert acide, gris ; décor = verts doux, ciel pastel.
- **Perspective** : **diorama 2D** face caméra. Chaque élément a un emplacement
  réservé. **Tout est visible en même temps.**
- **Résolution** : 768 × 1024 (portrait iPad), `Scale.FIT` + centrage.
- **Police** : ronde et lisible (Fredoka / Baloo 2), fallback système.
- **Ergonomie enfant** : gros boutons, peu de texte, pictogrammes, animations claires.

## Game design

### La boucle quotidienne

1. Le soir, la joueuse déclare la journée via le **bilan** (fée ou sorcière).
2. **Fée gagne** → **+3 étoiles**.
3. **Sorcière gagne** → **2 Méchancetés** (abîme des éléments).
4. La joueuse dépense ses étoiles quand elle veut, **sur ce qu'elle choisit**.

### La forêt = l'interface

- En lançant le jeu, on voit **toute la forêt** : chaque élément à son niveau.
  Le niveau se lit au visuel **et** via « Niveau X ».
- **Taper un élément** (ou un emplacement vide) ouvre un petit panneau.
- **Compteur d'étoiles** discret dans un coin.
- Le **bilan** n'apparaît qu'à partir de 18h.

### Les éléments à améliorer

**20 éléments, chacun du niveau 1 au niveau 50**, en **5 paliers visuels**
(paliers = niveaux 1-10, 11-20, 21-30, 31-40, 41-50).

| # | Élément | Catégorie |
|---|---------|-----------|
| 1 | Cabane de la fée | Construction *(présente au départ)* |
| 2 | Grand Chêne | Arbre |
| 3 | Saule pleureur | Arbre |
| 4 | Bouleau argenté | Arbre |
| 5 | Pommier enchanté | Arbre |
| 6 | Haie fleurie | Végétation |
| 7 | Buisson à baies | Végétation |
| 8 | Tapis de mousse & fougères | Végétation |
| 9 | Parterre de fleurs | Fleurs |
| 10 | Roseraie | Fleurs |
| 11 | Champ de tulipes | Fleurs |
| 12 | Champignons lumineux | Lumières |
| 13 | Lucioles | Lumières |
| 14 | Fleurs de lune | Lumières |
| 15 | Source magique | Eau |
| 16 | Ruisseau | Eau |
| 17 | Étang aux nénuphars | Eau |
| 18 | Pont de lianes | Construction |
| 19 | Arches de pierre | Construction |
| 20 | Cercle magique | Magie |

### L'économie

- **1 ⭐ = +1 niveau** sur un élément déjà créé (jusqu'au niveau 50).
- **1 ⭐ = débloquer/créer** un élément absent (il apparaît au niveau 1).
- **Total pour tout maxer ≈ 1000 ⭐** :
  - débloquer 19 éléments restants : **19 ⭐**
  - monter les 20 éléments de 1 à 50 : **20 × 49 = 980 ⭐**
  - **total = 999 ⭐** → cohérent avec ~1 an à 3 ⭐ par jour.
- Les étoiles s'accumulent librement (pas de plafond).

### Les Méchancetés de la sorcière

Quand la sorcière gagne la journée :

- **2 Méchancetés**, chacune = **-1 niveau** sur un élément → -2 niveaux au total.
- La sorcière **ne descend jamais sous le niveau 1** et **ne détruit jamais** un élément.
- Cibles : éléments **créés** de niveau > 1, **au hasard**. S'il y a moins de 2 cibles,
  les Méchancetés en trop sont **esquivées** avec un message bienveillant.
- Visuel : la sorcière apparaît, lance un sort, l'élément se fane un peu.
- **Jour manqué = neutre** (ni fée ni sorcière) : ne pas punir les absences.

### Le bilan du soir

- Bouton **« Bilan du jour »** verrouillé **avant 18h** (« Le bilan s'ouvre à 18h ✨ »).
- À partir de 18h, si le bilan du jour n'est pas fait : le bouton s'illumine.
- Écran : **« Aujourd'hui, tu as plutôt été… »** avec deux grandes cartes
  **Fée** (douce, courageuse, aidante…) et **Sorcière** (colère, disputes…),
  chacune avec quelques mots-clés pour l'aider à réfléchir.
- **Un seul bilan par jour**, mémorisé par date locale (`YYYY-MM-DD`).
- Conséquence animée : pluie d'étoiles (fée) ou sort de la sorcière.

### Ton & messages

- Jamais culpabilisant, même quand la sorcière gagne : « demain est un nouveau jour ».
- La fée valorise l'effort, pas la perfection.
- Textes courts, illustrés, compréhensibles par une jeune enfant.

## Architecture technique

### Arborescence prévue

```
phaser-fee/
  index.html
  package.json
  vite.config.ts
  tsconfig.json
  public/
    manifest.webmanifest
    icons/…
  src/
    main.ts
    theme.ts
    scenes/
      BootScene.ts
      NamingScene.ts      // premier lancement : nom de la fée
      ForestScene.ts      // la forêt (interface principale + suivi)
      BilanScene.ts       // choix fée / sorcière (18h)
      ResultScene.ts      // conséquence + animation
    game/
      state.ts            // état du jeu + types
      upgrades.ts         // les 20 éléments et leurs 5 paliers
      economy.ts          // débloquer, dépenser, appliquer les Méchancetés
      daily.ts            // logique jour / 18h / une fois par jour
      storage.ts          // localStorage (sauvegarde / chargement / reset)
    ui/
      Button.ts
      UpgradePanel.ts     // panneau au tap : « Améliorer (1 ⭐) »
  AGENTS.md
  TODO.md
```

- **Logique séparée de Phaser** (`src/game/*`, fonctions pures) → testable.
- **Sauvegarde** (clé `fee.save.v1`) :
  ```
  {
    fairyName: string,
    stars: number,                 // étoiles disponibles
    elements: {                    // par id d'élément
      [id]: { created: boolean, level: number }   // level 1..50
    },
    lastBilanDate: string | null   // "YYYY-MM-DD"
  }
  ```
- **Date/heure** : heure locale de l'iPad ; le bilan se base sur la date du jour.

### Spécificités iOS / Safari (importantes)

- **Viewport** : `viewport-fit=cover`, pas de zoom (`user-scalable=no`),
  désactiver le rebond de scroll et le menu long-press.
- **Zones sûres** : tenir compte de l'encoche / barre de statut (`safe-area-inset`).
- **`localStorage`** : peut être purgé par iOS si l'app n'est pas utilisée ;
  prévoir une sauvegarde à chaque action (pas seulement à la fermeture).
- **Orientation** : verrouiller en portrait autant que possible.

### Support iPad / PWA

- `manifest.webmanifest` : nom, icônes, `display: standalone`, portrait.
- Balises Apple dans `index.html` (`apple-mobile-web-app-capable`, icône…).
- Service worker (`vite-plugin-pwa`) pour le **hors-ligne**.
- Installation : Safari → Partager → « Sur l'écran d'accueil ».

---

## Plan par phases

### Phase 1 — Mise en place
- [ ] `npm create vite` (template TS) + Vitest.
- [ ] Installer `phaser`.
- [ ] Scène de test qui se lance.
- [ ] `vite.config.ts` avec `base` = `/phaser-fee/` pour GitHub Pages.
- [ ] Scripts `dev` / `build` / `preview` / `test`.

### Phase 2 — Déploiement
- [ ] Repo GitHub + workflow Actions → Pages.
- [ ] Vérifier l'URL publiée.

### Phase 3 — PWA / écran d'accueil
- [ ] `manifest.webmanifest` + icônes.
- [ ] Balises Apple + `apple-touch-icon` + `viewport-fit`.
- [ ] Service worker hors-ligne.
- [ ] Tester « Sur l'écran d'accueil » sur l'iPad.

### Phase 4 — État & sauvegarde
- [ ] Types et état par défaut (`state.ts`) : 1 cabane niveau 1, 0 étoile.
- [ ] `storage.ts` (sauvegarder / charger / réinitialiser).
- [ ] Sauvegarde après **chaque** action.
- [ ] Tests unitaires de la sauvegarde.

### Phase 5 — Logique du jeu (fonctions pures)
- [ ] `upgrades.ts` : les 20 éléments + les 5 paliers visuels.
- [ ] `economy.ts` : débloquer (1 ⭐), améliorer (1 ⭐), appliquer 2 Méchancetés.
- [ ] `daily.ts` : règle des 18h, un bilan par jour, jour manqué = neutre.
- [ ] Tests Vitest de l'économie et du jour.

### Phase 6 — Scènes
- [ ] `BootScene` + `NamingScene` (nom de la fée au 1er lancement).
- [ ] `ForestScene` : emplacements réservés, éléments créés, « Niveau X »,
      compteur d'étoiles.
- [ ] `UpgradePanel` : au tap — améliorer (1 ⭐) ou **planter/créer (1 ⭐)**.
- [ ] `BilanScene` : verrouillage avant 18h, choix fée/sorcière.
- [ ] `ResultScene` : animation étoiles ou sort de la sorcière.
- [ ] Transitions entre scènes.

### Phase 7 — Habillage
- [ ] Police ronde, palette `theme.ts`.
- [ ] Visuels des 20 éléments × 5 paliers.
- [ ] La fée et la sorcière animées.
- [ ] Messages bienveillants (fée qui gagne et sorcière qui gagne).

### Phase 8 — Test sur iPad
- [ ] `npm run dev -- --host` puis ouvrir dans Safari (réseau local).
- [ ] Tester le tactile, l'orientation portrait, le plein écran, les zones sûres.
- [ ] Persistance après fermeture de l'app.
- [ ] Verrouillage avant 18h (en changeant l'heure de l'iPad).
- [ ] Un seul bilan par jour.
- [ ] Performances.

### Phase 9 — Lancement
- [ ] Nettoyage + commentaires.
- [ ] Reset (parents / test) caché (ex. appui long).
- [ ] README d'installation iPad.
- [ ] Mettre à jour `AGENTS.md` si les règles changent.

---

## Couverture du plan (vérification)

**Défini et complet :**
- Boucle quotidienne, bilan 18h, une fois par jour, jour manqué neutre.
- Économie : déblocage 1 ⭐, upgrade 1 ⭐, total 999 ⭐ ≈ 1 an.
- 20 éléments, 50 niveaux, 5 paliers, « Niveau X ».
- Méchancetés : -2 niveaux au hasard, jamais détruits, min niveau 1.
- Interface : la forêt comme unique écran de suivi.
- Architecture technique, sauvegarde, spécificités iOS, PWA.
- Phases de réalisation cochables.

**Volontairement laissé pour plus tard (contenu, pas structure) :**
- Le dessin exact des 20 × 5 paliers.
- Les textes/messages exacts.
- La disposition précise des emplacements dans le décor.

## Questions ouvertes (restantes)

- **Messages exacts** des deux issues du bilan — à écrire avec soin (cœur du jeu,
  c'est du contenu, on peut le faire en Phase 7).
