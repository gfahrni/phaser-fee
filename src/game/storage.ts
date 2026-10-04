import type { SaveState } from './types';
import { createInitialState } from './state';

const KEY = 'fee.save.v1';

function hasStorage(): boolean {
  return typeof localStorage !== 'undefined';
}

export function loadState(): SaveState {
  if (!hasStorage()) return createInitialState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Partial<SaveState>;
    // Fusion avec l'état par défaut : tolère les sauvegardes plus anciennes.
    return { ...createInitialState(), ...parsed };
  } catch {
    return createInitialState();
  }
}

export function saveState(state: SaveState): void {
  if (!hasStorage()) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Stockage plein ou indisponible : on ignore pour ne pas casser le jeu.
  }
}

export function resetState(): SaveState {
  const state = createInitialState();
  saveState(state);
  return state;
}
