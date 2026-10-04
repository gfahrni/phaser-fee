import type { SaveState } from './types';

export const MAX_LEVEL = 50;
export const UPGRADE_COST = 1;
export const UNLOCK_COST = 1;
export const STARS_PER_FAIRY_WIN = 3;
export const MISCHIEFS_PER_WITCH_WIN = 2;

function clone(state: SaveState): SaveState {
  const elements: SaveState['elements'] = {};
  for (const [id, e] of Object.entries(state.elements)) {
    elements[id] = { ...e };
  }
  return { ...state, elements };
}

export function isCreated(state: SaveState, id: string): boolean {
  return state.elements[id]?.created ?? false;
}

export function levelOf(state: SaveState, id: string): number {
  return state.elements[id]?.level ?? 0;
}

export function canUnlock(state: SaveState, id: string): boolean {
  return !isCreated(state, id) && state.stars >= UNLOCK_COST;
}

/** Crée un élément au niveau 1 pour 1 étoile. Renvoie l'état inchangé si impossible. */
export function unlockElement(state: SaveState, id: string): SaveState {
  if (!canUnlock(state, id)) return state;
  const next = clone(state);
  next.stars -= UNLOCK_COST;
  next.elements[id] = { created: true, level: 1 };
  return next;
}

export function canUpgrade(state: SaveState, id: string): boolean {
  return isCreated(state, id) && levelOf(state, id) < MAX_LEVEL && state.stars >= UPGRADE_COST;
}

/** Monte un élément de 1 niveau pour 1 étoile. Renvoie l'état inchangé si impossible. */
export function upgradeElement(state: SaveState, id: string): SaveState {
  if (!canUpgrade(state, id)) return state;
  const next = clone(state);
  next.stars -= UPGRADE_COST;
  next.elements[id] = { created: true, level: next.elements[id].level + 1 };
  return next;
}

/** La fée gagne la journée : +3 étoiles. */
export function fairyWins(state: SaveState): SaveState {
  const next = clone(state);
  next.stars += STARS_PER_FAIRY_WIN;
  return next;
}

/** [DEBUG] Crée tous les éléments et les met au niveau demandé (borné 1..MAX_LEVEL). */
export function setAllLevels(state: SaveState, level: number): SaveState {
  const next = clone(state);
  const clamped = Math.min(MAX_LEVEL, Math.max(1, Math.floor(level)));
  for (const id of Object.keys(next.elements)) {
    next.elements[id] = { created: true, level: clamped };
  }
  return next;
}

/**
 * La sorcière gagne : 2 Méchancetés, chacune retire 1 niveau à un élément créé
 * de niveau > 1, choisi au hasard. Jamais sous le niveau 1, jamais de destruction.
 */
export function applyMischiefs(state: SaveState, rng: () => number = Math.random): SaveState {
  const next = clone(state);
  const candidates = Object.keys(next.elements).filter((id) => {
    const e = next.elements[id];
    return e.created && e.level > 1;
  });

  for (let i = 0; i < MISCHIEFS_PER_WITCH_WIN; i++) {
    if (candidates.length === 0) break;
    const idx = Math.floor(rng() * candidates.length);
    const id = candidates[idx];
    next.elements[id].level -= 1;
    if (next.elements[id].level <= 1) {
      candidates.splice(idx, 1);
    }
  }
  return next;
}
