import Phaser from 'phaser';
import { COLORS, FONT } from '../theme';
import { makeButton } from './Button';

export interface DebugCallbacks {
  onAddStars: () => void;
  onFairyWin: () => void;
  onWitchWin: () => void;
  onToggleBilan: () => void;
  onReset: () => void;
  onSetAllLevels: (level: number) => void;
  bilanOpen: boolean;
}

/** Petit panneau de debug dans la zone du ciel (uniquement en mode debug). */
export function createDebugPanel(
  scene: Phaser.Scene,
  cb: DebugCallbacks,
): Phaser.GameObjects.Container {
  const container = scene.add.container(0, 0).setDepth(3000);
  const row1Y = 132;
  const row2Y = 182;
  const w = 150;
  const gap = 8;

  container.add(
    scene.add
      .text(20, row1Y - 34, 'DEBUG', { fontFamily: FONT, fontSize: '14px', color: '#ffffff' })
      .setOrigin(0, 0.5),
  );

  const row1: Array<[string, number, () => void]> = [
    ['+10 ⭐', 0x3f8f3a, cb.onAddStars],
    ['Fée +3', COLORS.fairy, cb.onFairyWin],
    ['Sorcière -2', COLORS.witch, cb.onWitchWin],
    [cb.bilanOpen ? 'Bilan: OUVERT' : 'Bilan: 18h', 0x555555, cb.onToggleBilan],
    ['Reset', 0xb03030, cb.onReset],
  ];
  let x = 20;
  for (const [label, color, action] of row1) {
    container.add(makeButton(scene, x + w / 2, row1Y, w, 40, label, color, true, action, 15));
    x += w + gap;
  }

  container.add(
    scene.add
      .text(20, row2Y, 'Tout niv.', { fontFamily: FONT, fontSize: '15px', color: '#ffffff' })
      .setOrigin(0, 0.5),
  );
  const lw = 110;
  let lx = 110;
  for (const level of [10, 20, 30, 40, 50]) {
    container.add(
      makeButton(scene, lx + lw / 2, row2Y, lw, 40, String(level), 0x2b6fa8, true, () => cb.onSetAllLevels(level), 15),
    );
    lx += lw + gap;
  }

  return container;
}
