# Fée — jeu de gestion quotidien

## L'idée

Un jeu de gestion quotidien où l'on s'occupe d'une **fée** et de sa forêt.
C'est un mélange de Tamagotchi (prendre soin de son personnage au fil des jours)
et de jeux de construction à la Clash of Clans (on développe sa base petit à petit,
ici la **forêt de la fée**).

La fée **lutte contre une sorcière**. Chaque jour, l'une des deux gagne la journée.

## La boucle quotidienne

Chaque jour, la joueuse (ou ses parents) déclare qui a gagné la journée :

- **La fée gagne** → elle gagne **3 étoiles**.
  - L'étoile est la monnaie du jeu : **1 étoile = 1 amélioration au choix**.
  - L'idée importante : la joueuse **choisit elle-même ce qu'elle veut améliorer**.
- **La sorcière gagne** → elle fait **2 Méchancetés**.
  - Une Méchanceté **casse / annule 2 améliorations**.

## L'interface du bilan

Il existe une interface pour indiquer qui a gagné aujourd'hui.
Elle **ne s'active qu'à partir de 18h**, et on y choisit **fée** ou **sorcière**.

## Le but du jeu (le vrai objectif)

Ce n'est pas juste un jeu : c'est un **outil pour aider une petite fille à prendre
confiance en elle** et à se comporter comme une **fée** plutôt que comme une
**sorcière** dans sa vie de tous les jours.

Le jeu est donc le reflet de son comportement réel :
**les parents décident, en fin de journée, du bilan de sa journée**, et ce bilan
est exprimé dans le jeu (victoire de la fée ou de la sorcière).

## Contraintes techniques

- Réalisé avec **Phaser**.
- Hébergé et distribué via **GitHub Pages**.
- Joué sur un **iPad**, dans **Safari**.
- Doit pouvoir être **installé/ajouté à l'écran d'accueil de l'iPad**
  (usage comme une app, plein écran).

> Pour l'instant, ce fichier décrit uniquement **l'idée derrière le jeu**.
> Il n'y a pas encore de plan de développement ni de choix de conception :
> ce sera défini plus tard.
