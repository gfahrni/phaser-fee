import { describe, it, expect } from 'vitest';
import { createInitialState } from '../src/game/state';
import { applyBilan, canBilan, hasBilanToday, todayKey } from '../src/game/daily';

const at = (hour: number): Date => new Date(2026, 0, 5, hour, 0, 0);

describe('daily', () => {
  it('le bilan est fermé avant 18h', () => {
    expect(canBilan(createInitialState(), at(17))).toBe(false);
    expect(applyBilan(createInitialState(), 2, 0, at(17)).applied).toBe(false);
  });

  it('le bilan est ouvert à partir de 18h', () => {
    expect(canBilan(createInitialState(), at(18))).toBe(true);
  });

  it('donne le nombre d’étoiles choisi et marque le jour', () => {
    const r = applyBilan(createInitialState(), 2, 0, at(18));
    expect(r.applied).toBe(true);
    expect(r.state.stars).toBe(2);
    expect(r.state.lastBilanDate).toBe(todayKey(at(18)));
    expect(r.hits).toHaveLength(0);
  });

  it('les sorcières cassent des éléments, et on sait lesquels', () => {
    const base = createInitialState();
    base.elements.foret = { created: true, level: 5 };
    const r = applyBilan(base, 0, 2, at(20), () => 0);
    expect(r.witches).toBe(2);
    expect(r.hits).toHaveLength(2);
    expect(r.hits[0].name).toBe('Forêt enchantée');
    expect(r.state.elements.foret.level).toBe(3);
    expect(r.state.stars).toBe(0);
  });

  it('on ne peut faire le bilan qu’une fois par jour', () => {
    const r1 = applyBilan(createInitialState(), 1, 0, at(19));
    expect(hasBilanToday(r1.state, at(20))).toBe(true);
    const r2 = applyBilan(r1.state, 1, 0, at(20));
    expect(r2.applied).toBe(false);
    expect(r2.state).toBe(r1.state);
  });

  it('borne les valeurs entre 0 et 3', () => {
    const r = applyBilan(createInitialState(), 9, 9, at(20));
    expect(r.stars).toBe(3);
    expect(r.witches).toBe(3);
  });
});
