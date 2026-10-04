import type { SaveState } from './types';
import { CASTLE_ID, ZONES } from './zones';

/** Au départ : le château niveau 1, toutes les régions verrouillées, 0 étoile. */
export function createInitialState(): SaveState {
  const elements: SaveState['elements'] = {};
  elements[CASTLE_ID] = { created: true, level: 1 };
  for (const zone of ZONES) {
    elements[zone.id] = { created: false, level: 0 };
  }
  return {
    fairyName: 'Fée',
    stars: 0,
    elements,
    lastBilanDate: null,
  };
}
