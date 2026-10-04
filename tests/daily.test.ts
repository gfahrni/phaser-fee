import { describe, it, expect } from 'vitest';
import { createInitialState } from '../src/game/state';
import { applyBilan, canBilan, hasBilanToday, todayKey } from '../src/game/daily';

const at = (hour: number): Date => new Date(2026, 0, 5, hour, 0, 0);

describe('daily', () => {
  it('le bilan est fermé avant 18h', () => {
    expect(canBilan(createInitialState(), at(17))).toBe(false);
  });

  it('le bilan est ouvert à partir de 18h', () => {
    expect(canBilan(createInitialState(), at(18))).toBe(true);
  });

  it('choisir la fée donne 3 étoiles et marque le jour', () => {
    const s = applyBilan(createInitialState(), 'fee', at(18));
    expect(s.stars).toBe(3);
    expect(s.lastBilanDate).toBe(todayKey(at(18)));
  });

  it('on ne peut faire le bilan qu’une fois par jour', () => {
    let s = applyBilan(createInitialState(), 'fee', at(19));
    expect(hasBilanToday(s, at(20))).toBe(true);
    const before = s;
    s = applyBilan(s, 'fee', at(20));
    expect(s).toBe(before);
  });

  it('choisir la sorcière applique des Méchancetés sans donner d’étoile', () => {
    const s = applyBilan(createInitialState(), 'sorciere', at(20));
    expect(s.stars).toBe(0);
    expect(s.lastBilanDate).toBe(todayKey(at(20)));
  });
});
