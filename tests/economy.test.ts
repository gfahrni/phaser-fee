import { describe, it, expect } from 'vitest';
import { createInitialState } from '../src/game/state';
import {
  applyMischiefs,
  canUnlock,
  fairyWins,
  setAllLevels,
  unlockAllZones,
  unlockBlockReason,
  unlockElement,
  upgradeElement,
  MAX_LEVEL,
} from '../src/game/economy';
import { CASTLE_ID, GATE_LEVEL, OUTER_IDS, ZONE_ORDER, ZONES } from '../src/game/zones';

describe('economy', () => {
  it('démarre avec le château niveau 1 et 0 étoile', () => {
    const s = createInitialState();
    expect(s.stars).toBe(0);
    expect(s.elements[CASTLE_ID]).toEqual({ created: true, level: 1 });
    expect(s.elements.foret.created).toBe(false);
  });

  it('améliorer le château coûte 1 étoile', () => {
    let s = fairyWins(createInitialState());
    s = upgradeElement(s, CASTLE_ID);
    expect(s.stars).toBe(2);
    expect(s.elements[CASTLE_ID].level).toBe(2);
  });

  it('la première région est déblocable dès qu’on a une étoile', () => {
    let s = createInitialState();
    expect(unlockBlockReason(s, ZONE_ORDER[0])).toMatch(/étoile/);
    s = fairyWins(s);
    expect(canUnlock(s, ZONE_ORDER[0])).toBe(true);
  });

  it('la région suivante exige la précédente au niveau 10', () => {
    let s = fairyWins(createInitialState());
    s = unlockElement(s, ZONE_ORDER[0]);
    s = { ...s, stars: 100 };
    expect(canUnlock(s, ZONE_ORDER[1])).toBe(false);
    expect(unlockBlockReason(s, ZONE_ORDER[1])).toMatch(/niveau 10/);

    for (let i = 1; i < GATE_LEVEL; i++) s = upgradeElement(s, ZONE_ORDER[0]);
    expect(s.elements[ZONE_ORDER[0]].level).toBe(GATE_LEVEL);
    expect(canUnlock(s, ZONE_ORDER[1])).toBe(true);
  });

  it('les extérieures sont toutes disponibles d’un coup quand les intérieures sont à 10', () => {
    let s = { ...createInitialState(), stars: 1000 };
    for (let i = 0; i < 6; i++) {
      s = unlockElement(s, ZONE_ORDER[i]);
      for (let l = 1; l < GATE_LEVEL; l++) s = upgradeElement(s, ZONE_ORDER[i]);
    }
    for (const id of OUTER_IDS) expect(canUnlock(s, id)).toBe(true);
  });

  it('après une extérieure ouverte, il faut la monter à 10 pour en ouvrir une autre', () => {
    let s = { ...createInitialState(), stars: 1000 };
    for (let i = 0; i < 6; i++) {
      s = unlockElement(s, ZONE_ORDER[i]);
      for (let l = 1; l < GATE_LEVEL; l++) s = upgradeElement(s, ZONE_ORDER[i]);
    }
    const first = OUTER_IDS[0];
    const second = OUTER_IDS[3];
    s = unlockElement(s, first);
    expect(canUnlock(s, second)).toBe(false);
    expect(unlockBlockReason(s, second)).toMatch(/extérieures déjà ouvertes/);
    for (let l = 1; l < GATE_LEVEL; l++) s = upgradeElement(s, first);
    expect(canUnlock(s, second)).toBe(true);
  });

  it('les Méchancetés enlèvent 2 niveaux mais jamais sous 1', () => {
    let s = { ...createInitialState(), stars: 10 };
    s = upgradeElement(s, CASTLE_ID); // 2
    s = upgradeElement(s, CASTLE_ID); // 3
    s = applyMischiefs(s, () => 0);
    expect(s.elements[CASTLE_ID].level).toBe(1);
  });

  it('les Méchancetés sont esquivées quand rien à casser', () => {
    const s = createInitialState();
    const out = applyMischiefs(s, () => 0);
    expect(out.elements[CASTLE_ID].level).toBe(1);
  });

  it('setAllLevels crée tout le monde au niveau demandé, borné au max', () => {
    const ids = [CASTLE_ID, ...ZONES.map((z) => z.id)];
    const s = setAllLevels(createInitialState(), 10);
    expect(ids.every((id) => s.elements[id].created && s.elements[id].level === 10)).toBe(true);
    const capped = setAllLevels(createInitialState(), 999);
    expect(ids.every((id) => capped.elements[id].level === MAX_LEVEL)).toBe(true);
  });

  it('unlockAllZones ouvre toutes les régions au niveau 1', () => {
    const s = unlockAllZones(createInitialState());
    expect(ZONES.every((z) => s.elements[z.id].created && s.elements[z.id].level === 1)).toBe(true);
  });
});
