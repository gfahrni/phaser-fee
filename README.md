# Fée

Jeu de gestion quotidien : on développe la forêt d'une fée qui lutte contre
une sorcière. La vue est une **carte vue du dessus** : le **Château de la Fée**
au centre, entouré de **18 régions** (anneau intérieur puis anneau extérieur).
Chaque soir, le bilan permet de choisir un **nombre d'étoiles (0-3)** et un
**nombre de sorcières (0-3)** : les étoiles enrichissent la fée, chaque sorcière
casse un niveau et l'écran liste **quelles régions** ont été abîmées.

Progression : chaque niveau ajoute un objet visible dans la région, chaque palier
(tous les 10 niveaux) change la couleur et ajoute un monument. **Libre choix** :
une région s'ouvre dès que toutes les régions déjà ouvertes sont au niveau 10
(les extérieures exigent en plus que les 6 intérieures soient au niveau 10).
Une région verrouillée non déblocable **n'apparaît pas** : dès qu'on peut en
ouvrir une et qu'on a une étoile, elle s'affiche avec un cadenas.

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

**Cheat code** (utile dans l'app installée sur l'iPad, sans outil) :
appuyer **3× sur le bouton Bilan**, puis **ouvrir/fermer le château 3×**,
puis **3× sur Bilan**. Le panneau debug s'ouvre. Le bouton **Quitter debug**
le referme (et efface le réglage).

Le panneau propose : **+10 ⭐**, **Fée +3**, **Sorcière -2**,
**Bilan: OUVERT / 18h** (force ou non la règle des 18h), **Tout ouvrir**
(débloque toutes les régions) et **Reset**. Une seconde rangée met **tout au
niveau 10, 20, 30, 40 ou 50**. Le panneau se replie via le bouton **🔧 Debug**.

## Déploiement

Le déploiement est automatique : chaque `push` sur `main` déclenche
GitHub Actions qui publie le build sur **GitHub Pages**.
