import { describe, it, expect } from 'vitest';
import { createInitialState } from '../src/game/state';
import {
  applyMischiefs,
  fairyWins,
  setAllLevels,
  unlockElement,
  upgradeElement,
  MAX_LEVEL,
} from '../src/game/economy';

describe('economy', () => {
  it('démarre avec seulement la cabane niveau 1 et 0 étoile', () => {
    const s = createInitialState();
    expect(s.stars).toBe(0);
    expect(s.elements.cabane).toEqual({ created: true, level: 1 });
    expect(s.elements.chene.created).toBe(false);
  });

  it('ne peut pas débloquer sans étoile', () => {
    const s = createInitialState();
    expect(unlockElement(s, 'chene')).toBe(s);
  });

  it('débloquer coûte 1 étoile et crée au niveau 1', () => {
    let s = fairyWins(createInitialState()); // 3 étoiles
    s = unlockElement(s, 'chene');
    expect(s.stars).toBe(2);
    expect(s.elements.chene).toEqual({ created: true, level: 1 });
  });

  it('améliorer coûte 1 étoile et monte le niveau', () => {
    let s = fairyWins(createInitialState());
    s = upgradeElement(s, 'cabane');
    expect(s.stars).toBe(2);
    expect(s.elements.cabane.level).toBe(2);
  });

  it('ne dépasse pas le niveau maximum', () => {
    let s = createInitialState();
    s = { ...s, stars: MAX_LEVEL * 2 };
    for (let i = 0; i < MAX_LEVEL + 5; i++) s = upgradeElement(s, 'cabane');
    expect(s.elements.cabane.level).toBe(MAX_LEVEL);
  });

  it('les Méchancetés enlèvent 2 niveaux mais jamais sous 1', () => {
    let s = createInitialState();
    s = { ...s, stars: 10 };
    s = upgradeElement(s, 'cabane'); // 2
    s = upgradeElement(s, 'cabane'); // 3
    s = applyMischiefs(s, () => 0);
    expect(s.elements.cabane.level).toBe(1);
  });

  it('les Méchancetés sont esquivées quand rien à casser', () => {
    const s = createInitialState();
    const out = applyMischiefs(s, () => 0);
    expect(out.elements.cabane.level).toBe(1);
  });

  it('setAllLevels crée tout le monde au niveau demandé, borné au max', () => {
    const s = setAllLevels(createInitialState(), 10);
    expect(Object.values(s.elements).every((e) => e.created && e.level === 10)).toBe(true);
    const capped = setAllLevels(createInitialState(), 999);
    expect(Object.values(capped.elements).every((e) => e.level === MAX_LEVEL)).toBe(true);
  });
});
