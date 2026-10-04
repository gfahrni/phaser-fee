# Fée

Jeu de gestion quotidien : on développe la forêt d'une fée qui lutte contre
une sorcière. La vue est une **carte vue du dessus** : le **Château de la Fée**
au centre, entouré de **18 régions** (anneau intérieur puis anneau extérieur).
Chaque soir, le bilan de la journée fait gagner soit la fée (+3 étoiles),
soit la sorcière (2 Méchancetés).

Progression : chaque niveau ajoute un objet visible dans la région, chaque palier
(tous les 10 niveaux) change la couleur et ajoute un monument. Les régions
intérieures s'ouvrent dans l'ordre (précédentes au niveau 10). Les extérieures
deviennent toutes disponibles d'un coup dès que les 6 intérieures sont au
niveau 10, puis libre choix : il faut monter à 10 une extérieure ouverte avant
d'en ouvrir une autre.

L'idée d'origine et le plan sont archivés dans [`idee_depart/`](idee_depart/).

## Développement

```bash
npm install
npm run dev      # serveur local
npm run test     # tests unitaires (vitest)
npm run build    # build de production dans dist/
```

## Tester sur l'iPad (réseau local)

1. Lancer `npm run dev` sur l'ordinateur.
2. Sur l'iPad, ouvrir Safari à l'adresse **Network** affichée
   (ex. `http://192.168.x.x:5173/phaser-fee/`).

## Installer sur l'iPad (écran d'accueil)

1. Ouvrir le site dans **Safari**.
2. Bouton **Partager** → **Sur l'écran d'accueil**.
3. Lancer l'icône « Fée » : elle s'ouvre en plein écran, comme une app.

## Mode debug

Un panneau de debug apparaît automatiquement en développement (`npm run dev`).
Pour l'activer ailleurs (dont le site en ligne), ajouter `?debug` à l'URL :

```
https://gfahrni.github.io/phaser-fee/?debug
```

Autre méthode : dans la console du navigateur,
`localStorage.setItem('fee.debug','1')` puis recharger.

Le panneau propose : **+10 ⭐**, **Fée +3**, **Sorcière -2**,
**Bilan: OUVERT / 18h** (force ou non la règle des 18h), **Tout ouvrir**
(débloque toutes les régions) et **Reset**. Une seconde rangée met **tout au
niveau 10, 20, 30, 40 ou 50**. Le panneau se replie via le bouton **🔧 Debug**.

## Déploiement

Le déploiement est automatique : chaque `push` sur `main` déclenche
GitHub Actions qui publie le build sur **GitHub Pages**.
