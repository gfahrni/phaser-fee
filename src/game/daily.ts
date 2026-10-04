import type { SaveState } from './types';
import { addStars, applyMischiefsDetailed, type MischiefHit } from './economy';

/** Heure à partir de laquelle le bilan du jour s'ouvre. */
export const BILAN_HOUR = 18;
export const MAX_STARS_PER_DAY = 3;
export const MAX_WITCHES_PER_DAY = 3;

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
export function canBilan(state: SaveState, now: Date = new Date(), ignoreHour = false): boolean {
  return (ignoreHour || isAfterBilanHour(now)) && !hasBilanToday(state, now);
}

export interface BilanResult {
  state: SaveState;
  applied: boolean;
  stars: number;
  witches: number;
  hits: MischiefHit[];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.floor(value)));
}

/**
 * Bilan du jour : la joueuse choisit un nombre d'étoiles (0-3) et un nombre de
 * sorcières (0-3). Chaque sorcière = 1 Méchanceté (elle casse 1 niveau).
 */
export function applyBilan(
  state: SaveState,
  stars: number,
  witches: number,
  now: Date = new Date(),
  rng: () => number = Math.random,
  ignoreHour = false,
): BilanResult {
  if (!canBilan(state, now, ignoreHour)) {
    return { state, applied: false, stars: 0, witches: 0, hits: [] };
  }
  const s = clamp(stars, 0, MAX_STARS_PER_DAY);
  const w = clamp(witches, 0, MAX_WITCHES_PER_DAY);

  const withStars = s > 0 ? addStars(state, s) : state;
  const { state: after, hits } = applyMischiefsDetailed(withStars, w, rng);

  return {
    state: { ...after, lastBilanDate: todayKey(now) },
    applied: true,
    stars: s,
    witches: w,
    hits,
  };
}
