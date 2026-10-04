/** État d'un élément de la forêt. `level` va de 1 à MAX_LEVEL quand `created`. */
export interface ElementState {
  created: boolean;
  level: number;
}

/** Sauvegarde complète du jeu (clé `fee.save.v1`). */
export interface SaveState {
  fairyName: string;
  stars: number;
  elements: Record<string, ElementState>;
  /** Date locale du dernier bilan saisi, au format YYYY-MM-DD. */
  lastBilanDate: string | null;
}
