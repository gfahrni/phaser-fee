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
  /** Emplacement fixe dans le décor (1024 x 768). */
  x: number;
  y: number;
}

/**
 * Les 20 éléments de la forêt. Chacun a un emplacement fixe.
 * Seule la cabane existe au départ (voir `createInitialState`).
 */
export const ELEMENTS: ElementDef[] = [
  { id: 'cabane', name: 'Cabane de la fée', category: 'Construction', kind: 'building', color: 0xc98a4b, x: 512, y: 590 },
  { id: 'chene', name: 'Grand Chêne', category: 'Arbre', kind: 'tree', color: 0x3f8f3a, x: 180, y: 560 },
  { id: 'saule', name: 'Saule pleureur', category: 'Arbre', kind: 'tree', color: 0x8bc34a, x: 850, y: 570 },
  { id: 'bouleau', name: 'Bouleau argenté', category: 'Arbre', kind: 'tree', color: 0x9ccc65, x: 270, y: 450 },
  { id: 'pommier', name: 'Pommier enchanté', category: 'Arbre', kind: 'tree', color: 0x66bb6a, x: 760, y: 450 },
  { id: 'haie', name: 'Haie fleurie', category: 'Végétation', kind: 'bush', color: 0x66a63e, x: 140, y: 720 },
  { id: 'buisson', name: 'Buisson à baies', category: 'Végétation', kind: 'bush', color: 0x4f8a3d, x: 300, y: 690 },
  { id: 'mousse', name: 'Tapis de mousse', category: 'Végétation', kind: 'moss', color: 0x4f8a3d, x: 620, y: 720 },
  { id: 'parterre', name: 'Parterre de fleurs', category: 'Fleurs', kind: 'flower', color: 0xff8fb1, x: 80, y: 650 },
  { id: 'roseraie', name: 'Roseraie', category: 'Fleurs', kind: 'flower', color: 0xe0527a, x: 950, y: 650 },
  { id: 'tulipes', name: 'Champ de tulipes', category: 'Fleurs', kind: 'flower', color: 0xff6f91, x: 740, y: 700 },
  { id: 'champignons', name: 'Champignons lumineux', category: 'Lumières', kind: 'mushroom', color: 0xe4572e, x: 430, y: 700 },
  { id: 'lucioles', name: 'Lucioles', category: 'Lumières', kind: 'light', color: 0xffe066, x: 600, y: 360 },
  { id: 'fleursdelune', name: 'Fleurs de lune', category: 'Lumières', kind: 'light', color: 0xd7b3ff, x: 890, y: 430 },
  { id: 'source', name: 'Source magique', category: 'Eau', kind: 'water', color: 0x4fc3f7, x: 180, y: 750 },
  { id: 'ruisseau', name: 'Ruisseau', category: 'Eau', kind: 'water', color: 0x4fc3f7, x: 520, y: 745 },
  { id: 'etang', name: 'Étang aux nénuphars', category: 'Eau', kind: 'water', color: 0x4fc3f7, x: 860, y: 730 },
  { id: 'pont', name: 'Pont de lianes', category: 'Construction', kind: 'building', color: 0x9c6b3f, x: 512, y: 690 },
  { id: 'arches', name: 'Arches de pierre', category: 'Construction', kind: 'arch', color: 0x9e9e9e, x: 512, y: 400 },
  { id: 'cercle', name: 'Cercle magique', category: 'Magie', kind: 'magic', color: 0xb388ff, x: 350, y: 580 },
];

/** Nombre de paliers visuels par élément. */
export const TIER_COUNT = 5;

/** Palier visuel (1 à 5) correspondant à un niveau (1 à 50). */
export function tierForLevel(level: number): number {
  const tier = Math.ceil(level / (50 / TIER_COUNT));
  return Math.min(TIER_COUNT, Math.max(1, tier));
}
