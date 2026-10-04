import Phaser from 'phaser';
import { FONT } from '../theme';

/** Bouton simple : rectangle arrondi + texte, gros pour les doigts d'enfant. */
export function makeButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  color: number,
  enabled: boolean,
  onClick: () => void,
  fontSize = 22,
): Phaser.GameObjects.Container {
  const container = scene.add.container(x, y);
  const bg = scene.add.rectangle(0, 0, w, h, color).setStrokeStyle(3, 0xffffff, 0.85);
  const text = scene.add
    .text(0, 0, label, { fontFamily: FONT, fontSize: `${fontSize}px`, color: '#ffffff' })
    .setOrigin(0.5);
  container.add([bg, text]);

  if (enabled) {
    bg.setInteractive({ useHandCursor: true }).on('pointerdown', onClick);
  } else {
    container.setAlpha(0.45);
  }
  return container;
}
