/** Nature de l'élément, utilisée pour choisir la façon de le dessiner. */
export type ElementKind =
  | 'tree'
  | 'flower'
  | 'bush'
  | 'water'
  | 'building'
  | 'mushroom'
  | 'light'
  | 'arch'
  | 'magic'
  | 'moss';

export interface ElementDef {
  id: string;
  name: string;
  category: string;
  kind: ElementKind;
  /** Couleur principale (nombre Phaser). */
  color: number;
  /** Emplacement fixe dans le décor (768 x 1024). */
  x: number;
  y: number;
}

/**
 * Les 20 éléments de la forêt. Chacun a un emplacement fixe.
 * Seule la cabane existe au départ (voir `createInitialState`).
 */
export const ELEMENTS: ElementDef[] = [
  { id: 'cabane', name: 'Cabane de la fée', category: 'Construction', kind: 'building', color: 0xc98a4b, x: 388, y: 690 },
  { id: 'chene', name: 'Grand Chêne', category: 'Arbre', kind: 'tree', color: 0x3f8f3a, x: 120, y: 640 },
  { id: 'saule', name: 'Saule pleureur', category: 'Arbre', kind: 'tree', color: 0x8bc34a, x: 660, y: 650 },
  { id: 'bouleau', name: 'Bouleau argenté', category: 'Arbre', kind: 'tree', color: 0x9ccc65, x: 185, y: 510 },
  { id: 'pommier', name: 'Pommier enchanté', category: 'Arbre', kind: 'tree', color: 0x66bb6a, x: 585, y: 515 },
  { id: 'haie', name: 'Haie fleurie', category: 'Végétation', kind: 'bush', color: 0x66a63e, x: 95, y: 890 },
  { id: 'buisson', name: 'Buisson à baies', category: 'Végétation', kind: 'bush', color: 0x4f8a3d, x: 225, y: 805 },
  { id: 'mousse', name: 'Tapis de mousse', category: 'Végétation', kind: 'moss', color: 0x4f8a3d, x: 410, y: 905 },
  { id: 'parterre', name: 'Parterre de fleurs', category: 'Fleurs', kind: 'flower', color: 0xff8fb1, x: 65, y: 775 },
  { id: 'roseraie', name: 'Roseraie', category: 'Fleurs', kind: 'flower', color: 0xe0527a, x: 700, y: 785 },
  { id: 'tulipes', name: 'Champ de tulipes', category: 'Fleurs', kind: 'flower', color: 0xff6f91, x: 575, y: 815 },
  { id: 'champignons', name: 'Champignons lumineux', category: 'Lumières', kind: 'mushroom', color: 0xe4572e, x: 300, y: 875 },
  { id: 'lucioles', name: 'Lucioles', category: 'Lumières', kind: 'light', color: 0xffe066, x: 480, y: 415 },
  { id: 'fleursdelune', name: 'Fleurs de lune', category: 'Lumières', kind: 'light', color: 0xd7b3ff, x: 685, y: 520 },
  { id: 'source', name: 'Source magique', category: 'Eau', kind: 'water', color: 0x4fc3f7, x: 150, y: 955 },
  { id: 'ruisseau', name: 'Ruisseau', category: 'Eau', kind: 'water', color: 0x4fc3f7, x: 455, y: 955 },
  { id: 'etang', name: 'Étang aux nénuphars', category: 'Eau', kind: 'water', color: 0x4fc3f7, x: 625, y: 945 },
  { id: 'pont', name: 'Pont de lianes', category: 'Construction', kind: 'building', color: 0x9c6b3f, x: 388, y: 815 },
  { id: 'arches', name: 'Arches de pierre', category: 'Construction', kind: 'arch', color: 0x9e9e9e, x: 388, y: 470 },
  { id: 'cercle', name: 'Cercle magique', category: 'Magie', kind: 'magic', color: 0xb388ff, x: 255, y: 690 },
];

/** Nombre de paliers visuels par élément. */
export const TIER_COUNT = 5;

/** Palier visuel (1 à 5) correspondant à un niveau (1 à 50). */
export function tierForLevel(level: number): number {
  const tier = Math.ceil(level / (50 / TIER_COUNT));
  return Math.min(TIER_COUNT, Math.max(1, tier));
}
