/** Forme dessinée pour les petits objets d'une région (et son monument). */
export type ObjectKind =
  | 'tree'
  | 'flower'
  | 'mushroom'
  | 'light'
  | 'unicorn'
  | 'crystal'
  | 'shell'
  | 'palm'
  | 'rainbow'
  | 'butterfly'
  | 'bunny'
  | 'candy';

export interface ZoneDef {
  id: string;
  name: string;
  ring: 'inner' | 'outer';
  /** Couleur de base du terrain (les paliers l'éclaircissent). */
  base: number;
  /** Couleur des objets de la région. */
  accent: number;
  objectKind: ObjectKind;
  /** Position sur la carte (1180 x 820). */
  x: number;
  y: number;
  /** Taille de la tuile. */
  w: number;
  h: number;
}

/** Le château central (toujours présent). */
export const CASTLE_ID = 'chateau';
export const CASTLE_NAME = 'Château de la Fée';

/**
 * Les 18 régions : 6 dans l'anneau intérieur, 12 dans l'anneau extérieur.
 * L'ordre de la liste = l'ordre de déblocage.
 */
export const ZONES: ZoneDef[] = [
  // --- Anneau intérieur (6) ---
  { id: 'foret', name: 'Forêt enchantée', ring: 'inner', base: 0x2f6d3a, accent: 0x4caf50, objectKind: 'tree', x: 590, y: 260, w: 168, h: 140 },
  { id: 'prairie', name: 'Prairie fleurie', ring: 'inner', base: 0x7cc76a, accent: 0xff8fb1, objectKind: 'flower', x: 815, y: 352, w: 168, h: 140 },
  { id: 'cerisiers', name: 'Cerisiers en fleurs', ring: 'inner', base: 0xe8a7c0, accent: 0xffc2d6, objectKind: 'flower', x: 815, y: 538, w: 168, h: 140 },
  { id: 'tournesols', name: 'Champ de tournesols', ring: 'inner', base: 0xe0b53a, accent: 0xffd447, objectKind: 'flower', x: 590, y: 630, w: 168, h: 140 },
  { id: 'champignons', name: 'Vallée des champignons', ring: 'inner', base: 0x6b4a7a, accent: 0xe4572e, objectKind: 'mushroom', x: 365, y: 538, w: 168, h: 140 },
  { id: 'lucioles', name: 'Clairière des lucioles', ring: 'inner', base: 0x24304f, accent: 0xffe066, objectKind: 'light', x: 365, y: 352, w: 168, h: 140 },

  // --- Anneau extérieur (12) ---
  { id: 'licornes', name: 'Prairies des licornes', ring: 'outer', base: 0xb9a7e0, accent: 0xffb3e6, objectKind: 'unicorn', x: 1085, y: 445, w: 150, h: 128 },
  { id: 'neige', name: 'Pics enneigés', ring: 'outer', base: 0xbcd6e8, accent: 0xffffff, objectKind: 'tree', x: 1019, y: 595, w: 150, h: 128 },
  { id: 'glace', name: 'Pays de glace', ring: 'outer', base: 0x8fd0ff, accent: 0xcdefff, objectKind: 'crystal', x: 838, y: 705, w: 150, h: 128 },
  { id: 'lac', name: 'Lac aux nénuphars', ring: 'outer', base: 0x3f8fb0, accent: 0x9fe0c0, objectKind: 'flower', x: 590, y: 745, w: 150, h: 128 },
  { id: 'sirenes', name: 'Crique des sirènes', ring: 'outer', base: 0x2fb0a8, accent: 0xffd9a0, objectKind: 'shell', x: 343, y: 705, w: 150, h: 128 },
  { id: 'dunes', name: 'Dunes dorées', ring: 'outer', base: 0xe0c07a, accent: 0x8bc34a, objectKind: 'palm', x: 161, y: 595, w: 150, h: 128 },
  { id: 'arcenciel', name: 'Vallée des arcs-en-ciel', ring: 'outer', base: 0xa9d0ff, accent: 0xff6f91, objectKind: 'rainbow', x: 95, y: 445, w: 150, h: 128 },
  { id: 'cristaux', name: 'Grotte de cristaux', ring: 'outer', base: 0x5a4a8f, accent: 0x9fe8ff, objectKind: 'crystal', x: 161, y: 295, w: 150, h: 128 },
  { id: 'lune', name: 'Jardin de lune', ring: 'outer', base: 0x1f2a4a, accent: 0xd7b3ff, objectKind: 'light', x: 343, y: 185, w: 150, h: 128 },
  { id: 'papillons', name: 'Plaine des papillons', ring: 'outer', base: 0xbfe0b0, accent: 0xff9ecb, objectKind: 'butterfly', x: 590, y: 145, w: 150, h: 128 },
  { id: 'lapins', name: 'Village des lapins', ring: 'outer', base: 0x9c7a52, accent: 0xfff0e0, objectKind: 'bunny', x: 838, y: 185, w: 150, h: 128 },
  { id: 'bonbons', name: 'Pays des bonbons', ring: 'outer', base: 0xffb3d9, accent: 0x9fe0c0, objectKind: 'candy', x: 1019, y: 295, w: 150, h: 128 },
];

export const INNER_IDS = ZONES.filter((z) => z.ring === 'inner').map((z) => z.id);
export const OUTER_IDS = ZONES.filter((z) => z.ring === 'outer').map((z) => z.id);
/** Ordre de déblocage : intérieures puis extérieures. */
export const ZONE_ORDER = [...INNER_IDS, ...OUTER_IDS];

export function zoneById(id: string): ZoneDef | undefined {
  return ZONES.find((z) => z.id === id);
}

/** Niveau minimum exigé sur les régions précédentes pour en débloquer une nouvelle. */
export const GATE_LEVEL = 10;

/** Facteur d'agrandissement des octogones de région (les formes gardent leur taille). */
export const ZONE_TILE_SCALE = 1.2;

/** Nombre de paliers visuels par région. */
export const TIER_COUNT = 5;

/** Palier visuel (1 à 5) correspondant à un niveau (1 à 50). */
export function tierForLevel(level: number): number {
  const tier = Math.ceil(level / (50 / TIER_COUNT));
  return Math.min(TIER_COUNT, Math.max(1, tier));
}

/** Éclaircit (amount > 0) ou assombrit (amount < 0) une couleur 0xRRGGBB. */
export function shade(color: number, amount: number): number {
  const r = (color >> 16) & 0xff;
  const g = (color >> 8) & 0xff;
  const b = color & 0xff;
  const adj = (c: number) => Math.round(amount >= 0 ? c + (255 - c) * amount : c * (1 + amount));
  return (adj(r) << 16) | (adj(g) << 8) | adj(b);
}
