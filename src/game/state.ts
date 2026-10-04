import type { SaveState } from './types';
import { ELEMENTS } from './upgrades';

/** Au départ : la cabane niveau 1, rien d'autre, 0 étoile. */
export function createInitialState(): SaveState {
  const elements: SaveState['elements'] = {};
  for (const el of ELEMENTS) {
    elements[el.id] = { created: false, level: 0 };
  }
  elements.cabane = { created: true, level: 1 };
  return {
    fairyName: 'Fée',
    stars: 0,
    elements,
    lastBilanDate: null,
  };
}
