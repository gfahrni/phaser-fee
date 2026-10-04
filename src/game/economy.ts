import type { SaveState } from './types';
import { CASTLE_ID, CASTLE_NAME, GATE_LEVEL, INNER_IDS, ZONES, zoneById } from './zones';

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

/**
 * Pourquoi une région ne peut pas être ouverte (null = déblocable).
 * Règle : libre choix, mais toutes les régions DÉJÀ OUVERTES doivent être ≥ NIVEAU 10.
 * Les régions extérieures exigent en plus que les 6 intérieures soient ouvertes ≥ NIVEAU 10.
 */
export function unlockBlockReason(state: SaveState, id: string): string | null {
  if (isCreated(state, id)) return 'Région déjà ouverte';
  const zone = zoneById(id);
  if (!zone) return 'Région inconnue';
  if (state.stars < UNLOCK_COST) return 'Il te faut 1 étoile ⭐';

  for (const z of ZONES) {
    const e = state.elements[z.id];
    if (e?.created && e.level < GATE_LEVEL) {
      return `Monte tes régions ouvertes au niveau ${GATE_LEVEL}`;
    }
  }

  if (zone.ring === 'outer') {
    for (const innerId of INNER_IDS) {
      const inner = state.elements[innerId];
      if (!inner?.created || inner.level < GATE_LEVEL) {
        return `Ouvre les régions intérieures au niveau ${GATE_LEVEL}`;
      }
    }
  }
  return null;
}

export function canUnlock(state: SaveState, id: string): boolean {
  return !isCreated(state, id) && unlockBlockReason(state, id) === null;
}

/** Crée une région au niveau 1 pour 1 étoile. Renvoie l'état inchangé si impossible. */
export function unlockElement(state: SaveState, id: string): SaveState {
  if (!canUnlock(state, id)) return state;
  const next = clone(state);
  next.stars -= UNLOCK_COST;
  next.elements[id] = { created: true, level: 1 };
  return next;
}

/** La fée gagne la journée : +3 étoiles. */
export function fairyWins(state: SaveState): SaveState {
  return addStars(state, STARS_PER_FAIRY_WIN);
}

/** Ajoute des étoiles. */
export function addStars(state: SaveState, amount: number): SaveState {
  const next = clone(state);
  next.stars += Math.max(0, Math.floor(amount));
  return next;
}

/** Nom lisible d'un élément (région ou château). */
export function nameOf(id: string): string {
  if (id === CASTLE_ID) return CASTLE_NAME;
  return zoneById(id)?.name ?? id;
}

export interface MischiefHit {
  id: string;
  name: string;
  from: number;
  to: number;
}

/**
 * Applique `count` Méchancetés : chacune retire 1 niveau à un élément créé de
 * niveau > 1 (au hasard), jamais sous le niveau 1. Renvoie la liste des dégâts.
 */
export function applyMischiefsDetailed(
  state: SaveState,
  count: number,
  rng: () => number = Math.random,
): { state: SaveState; hits: MischiefHit[] } {
  const next = clone(state);
  const hits: MischiefHit[] = [];
  const candidates = Object.keys(next.elements).filter((id) => {
    const e = next.elements[id];
    return e.created && e.level > 1;
  });

  for (let i = 0; i < count; i++) {
    if (candidates.length === 0) break;
    const idx = Math.floor(rng() * candidates.length);
    const id = candidates[idx];
    const element = next.elements[id];
    const from = element.level;
    element.level -= 1;
    hits.push({ id, name: nameOf(id), from, to: element.level });
    if (element.level <= 1) {
      candidates.splice(idx, 1);
    }
  }
  return { state: next, hits };
}

/** Raccourci historique : 2 Méchancetés (une victoire de sorcière « pleine »). */
export function applyMischiefs(state: SaveState, rng: () => number = Math.random): SaveState {
  return applyMischiefsDetailed(state, MISCHIEFS_PER_WITCH_WIN, rng).state;
}

/** [DEBUG] Crée toutes les régions et met tout au niveau demandé (borné 1..MAX_LEVEL). */
export function setAllLevels(state: SaveState, level: number): SaveState {
  const next = clone(state);
  const clamped = Math.min(MAX_LEVEL, Math.max(1, Math.floor(level)));
  next.elements[CASTLE_ID] = { created: true, level: clamped };
  for (const zone of ZONES) {
    next.elements[zone.id] = { created: true, level: clamped };
  }
  return next;
}

/** [DEBUG] Débloque toutes les régions au niveau 1, sans tenir compte des règles. */
export function unlockAllZones(state: SaveState): SaveState {
  const next = clone(state);
  if (!next.elements[CASTLE_ID]?.created) {
    next.elements[CASTLE_ID] = { created: true, level: 1 };
  }
  for (const zone of ZONES) {
    if (!next.elements[zone.id]?.created) {
      next.elements[zone.id] = { created: true, level: 1 };
    }
  }
  return next;
}
