import Phaser from 'phaser';
import { COLORS, FONT, GAME_WIDTH, GAME_HEIGHT } from '../theme';
import { MAX_LEVEL } from '../game/economy';
import type { SaveState } from '../game/types';
import type { ElementDef } from '../game/upgrades';
import { makeButton } from './Button';

export interface UpgradePanelCallbacks {
  onUpgrade: (id: string) => void;
  onUnlock: (id: string) => void;
  onClose: () => void;
}

/** Panneau ouvert au tap sur un élément : améliorer, planter, ou fermer. */
export function createUpgradePanel(
  scene: Phaser.Scene,
  el: ElementDef,
  state: SaveState,
  cb: UpgradePanelCallbacks,
): Phaser.GameObjects.Container {
  const { width, height } = { width: GAME_WIDTH, height: GAME_HEIGHT };
  const container = scene.add.container(0, 0).setDepth(1000);

  const overlay = scene.add
    .rectangle(width / 2, height / 2, width, height, 0x000000, 0.45)
    .setInteractive();
  overlay.on('pointerdown', () => cb.onClose());
  container.add(overlay);

  const cardW = 520;
  const cardH = 360;
  const cardX = width / 2;
  const cardY = height / 2;

  const card = scene.add
    .rectangle(cardX, cardY, cardW, cardH, COLORS.panel)
    .setStrokeStyle(5, COLORS.panelStroke)
    .setInteractive();
  // On avale le tap sur la carte pour ne pas fermer le panneau.
  card.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, e: Phaser.Types.Input.EventData) => e.stopPropagation());
  container.add(card);

  const element = state.elements[el.id];
  const created = element?.created ?? false;
  const level = element?.level ?? 0;

  const title = scene.add
    .text(cardX, cardY - cardH / 2 + 44, el.name, {
      fontFamily: FONT,
      fontSize: '30px',
      color: '#2b3a1f',
    })
    .setOrigin(0.5);
  container.add(title);

  const subtitle = scene.add
    .text(
      cardX,
      cardY - cardH / 2 + 84,
      created ? `${el.category} • Niveau ${level} / ${MAX_LEVEL}` : `${el.category} • Emplacement vide`,
      { fontFamily: FONT, fontSize: '20px', color: '#7a6a3a' },
    )
    .setOrigin(0.5);
  container.add(subtitle);

  if (created && level >= MAX_LEVEL) {
    const txt = scene.add
      .text(cardX, cardY, 'Niveau maximum atteint ⭐', {
        fontFamily: FONT,
        fontSize: '24px',
        color: '#3f8f3a',
      })
      .setOrigin(0.5);
    container.add(txt);
  } else {
    const cost = created ? '1 ⭐' : '1 ⭐';
    const label = created ? `Améliorer (${cost})` : `Planter (${cost})`;
    const affordable = state.stars >= 1;
    const action = makeButton(
      scene,
      cardX,
      cardY - 4,
      300,
      66,
      label,
      affordable ? COLORS.ground : COLORS.disabled,
      affordable,
      () => (created ? cb.onUpgrade(el.id) : cb.onUnlock(el.id)),
      24,
    );
    container.add(action);

    if (!affordable) {
      const need = scene.add
        .text(cardX, cardY + 52, 'Il te faut 1 étoile ⭐', {
          fontFamily: FONT,
          fontSize: '18px',
          color: '#a06a2a',
        })
        .setOrigin(0.5);
      container.add(need);
    }
  }

  const close = makeButton(scene, cardX, cardY + cardH / 2 - 44, 160, 48, 'Fermer', COLORS.ink, true, cb.onClose, 18);
  container.add(close);

  return container;
}
