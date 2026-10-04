import type { SaveState } from './types';
import { applyMischiefs, fairyWins } from './economy';

/** Heure à partir de laquelle le bilan du jour s'ouvre. */
export const BILAN_HOUR = 18;

export type BilanChoice = 'fee' | 'sorciere';

/** Clé de date locale au format YYYY-MM-DD. */
export function todayKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isAfterBilanHour(now: Date = new Date()): boolean {
  return now.getHours() >= BILAN_HOUR;
}

export function hasBilanToday(state: SaveState, now: Date = new Date()): boolean {
  return state.lastBilanDate === todayKey(now);
}

/** Le bilan est possible s'il est ≥ 18h et s'il n'a pas déjà été fait aujourd'hui. */
export function canBilan(state: SaveState, now: Date = new Date()): boolean {
  return isAfterBilanHour(now) && !hasBilanToday(state, now);
}

/** Applique le bilan du jour. Renvoie l'état inchangé si le bilan n'est pas possible. */
export function applyBilan(
  state: SaveState,
  choice: BilanChoice,
  now: Date = new Date(),
  rng: () => number = Math.random,
): SaveState {
  if (!canBilan(state, now)) return state;
  const next = choice === 'fee' ? fairyWins(state) : applyMischiefs(state, rng);
  return { ...next, lastBilanDate: todayKey(now) };
}
