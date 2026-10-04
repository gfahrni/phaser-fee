import Phaser from 'phaser';
import { COLORS, FONT, GAME_WIDTH } from '../theme';
import { makeButton } from './Button';

export interface DebugCallbacks {
  onAddStars: () => void;
  onFairyWin: () => void;
  onWitchWin: () => void;
  onToggleBilan: () => void;
  onReset: () => void;
  onSetAllLevels: (level: number) => void;
  onUnlockAll: () => void;
  onExitDebug: () => void;
  bilanOpen: boolean;
}

/**
 * Panneau de debug repliable (uniquement en mode debug).
 * Un petit bouton « Debug » en haut à gauche ouvre/ferme l'overlay.
 */
export function createDebugPanel(
  scene: Phaser.Scene,
  cb: DebugCallbacks,
): Phaser.GameObjects.Container {
  const root = scene.add.container(0, 0).setDepth(4000);

  const panel = scene.add.container(0, 0).setVisible(false);
  panel.add(scene.add.rectangle(GAME_WIDTH / 2, 170, GAME_WIDTH, 150, 0x000000, 0.8));
  root.add(panel);

  const row1Y = 150;
  const row2Y = 200;
  const w = 168;
  const gap = 8;
  const row1: Array<[string, number, () => void]> = [
    ['+10 ⭐', 0x3f8f3a, cb.onAddStars],
    ['Fée +3', COLORS.fairy, cb.onFairyWin],
    ['Sorcière -2', COLORS.witch, cb.onWitchWin],
    [cb.bilanOpen ? 'Bilan: OUVERT' : 'Bilan: 18h', 0x555555, cb.onToggleBilan],
    ['Tout ouvrir', 0x2b6fa8, cb.onUnlockAll],
    ['Reset', 0xb03030, cb.onReset],
  ];
  let x = (GAME_WIDTH - (row1.length * w + (row1.length - 1) * gap)) / 2;
  for (const [label, color, action] of row1) {
    panel.add(makeButton(scene, x + w / 2, row1Y, w, 40, label, color, true, action, 15));
    x += w + gap;
  }

  panel.add(
    scene.add.text(120, row2Y, 'Tout niv.', { fontFamily: FONT, fontSize: '15px', color: '#ffffff' }).setOrigin(0, 0.5),
  );
  const lw = 110;
  let lx = 210;
  for (const level of [10, 20, 30, 40, 50]) {
    panel.add(makeButton(scene, lx + lw / 2, row2Y, lw, 40, String(level), 0x2b6fa8, true, () => cb.onSetAllLevels(level), 15));
    lx += lw + gap;
  }

  panel.add(makeButton(scene, 1040, row2Y, 220, 40, 'Quitter debug', 0xb03030, true, cb.onExitDebug, 15));

  root.add(
    makeButton(scene, 85, 92, 130, 36, '🔧 Debug', 0x333333, true, () => panel.setVisible(!panel.visible), 15),
  );

  return root;
}
