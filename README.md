# Fée

Jeu de gestion quotidien : on s'occupe de la forêt d'une fée qui lutte contre
une sorcière. Chaque soir, le bilan de la journée fait gagner soit la fée
(+3 étoiles), soit la sorcière (2 Méchancetés).

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
**Bilan: OUVERT / 18h** (force ou non la règle des 18h) et **Reset**.

## Déploiement

Le déploiement est automatique : chaque `push` sur `main` déclenche
GitHub Actions qui publie le build sur **GitHub Pages**.
