import Phaser from 'phaser';
import { COLORS, FONT, GAME_HEIGHT } from '../theme';
import { makeButton } from './Button';

export interface DebugCallbacks {
  onAddStars: () => void;
  onFairyWin: () => void;
  onWitchWin: () => void;
  onToggleBilan: () => void;
  onReset: () => void;
  bilanOpen: boolean;
}

/** Petit panneau de debug en bas de l'écran (uniquement en mode debug). */
export function createDebugPanel(
  scene: Phaser.Scene,
  cb: DebugCallbacks,
): Phaser.GameObjects.Container {
  const container = scene.add.container(0, 0).setDepth(3000);
  const y = GAME_HEIGHT - 34;

  container.add(
    scene.add
      .text(20, y - 38, 'DEBUG', { fontFamily: FONT, fontSize: '14px', color: '#ffffff' })
      .setOrigin(0, 0.5),
  );

  const items: Array<[string, number, () => void]> = [
    ['+10 ⭐', 0x3f8f3a, cb.onAddStars],
    ['Fée +3', COLORS.fairy, cb.onFairyWin],
    ['Sorcière -2', COLORS.witch, cb.onWitchWin],
    [cb.bilanOpen ? 'Bilan: OUVERT' : 'Bilan: 18h', 0x555555, cb.onToggleBilan],
    ['Reset', 0xb03030, cb.onReset],
  ];

  const w = 150;
  const gap = 8;
  let x = 20;
  for (const [label, color, action] of items) {
    container.add(makeButton(scene, x + w / 2, y, w, 40, label, color, true, action, 15));
    x += w + gap;
  }
  return container;
}
