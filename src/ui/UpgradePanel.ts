import Phaser from 'phaser';
import { COLORS, FONT, GAME_WIDTH, GAME_HEIGHT } from '../theme';
import { MAX_LEVEL } from '../game/economy';
import { makeButton } from './Button';

export interface UpgradePanelData {
  name: string;
  subtitle: string;
  created: boolean;
  level: number;
  /** Raison du blocage si non déblocable, sinon null. */
  unlockReason: string | null;
  stars: number;
}

export interface UpgradePanelCallbacks {
  onUpgrade: () => void;
  onUnlock: () => void;
  onClose: () => void;
}

/** Panneau ouvert au tap sur une région ou le château. */
export function createUpgradePanel(
  scene: Phaser.Scene,
  data: UpgradePanelData,
  cb: UpgradePanelCallbacks,
): Phaser.GameObjects.Container {
  const container = scene.add.container(0, 0).setDepth(1000);

  const overlay = scene.add
    .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.5)
    .setInteractive();
  overlay.on('pointerdown', () => cb.onClose());
  container.add(overlay);

  const cardW = 620;
  const cardH = 400;
  const cardX = GAME_WIDTH / 2;
  const cardY = GAME_HEIGHT / 2;

  const card = scene.add
    .rectangle(cardX, cardY, cardW, cardH, COLORS.panel)
    .setStrokeStyle(5, COLORS.panelStroke)
    .setInteractive();
  card.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, e: Phaser.Types.Input.EventData) =>
    e.stopPropagation(),
  );
  container.add(card);

  container.add(
    scene.add
      .text(cardX, cardY - cardH / 2 + 50, data.name, {
        fontFamily: FONT,
        fontSize: '32px',
        color: '#2b3a1f',
      })
      .setOrigin(0.5),
  );

  const info = data.created
    ? `${data.subtitle} • Niveau ${data.level} / ${MAX_LEVEL}`
    : `${data.subtitle}`;
  container.add(
    scene.add
      .text(cardX, cardY - cardH / 2 + 94, info, { fontFamily: FONT, fontSize: '20px', color: '#7a6a3a' })
      .setOrigin(0.5),
  );

  if (data.created) {
    if (data.level >= MAX_LEVEL) {
      container.add(
        scene.add
          .text(cardX, cardY, 'Niveau maximum atteint ⭐', {
            fontFamily: FONT,
            fontSize: '24px',
            color: '#3f8f3a',
          })
          .setOrigin(0.5),
      );
    } else {
      const affordable = data.stars >= 1;
      container.add(
        makeButton(scene, cardX, cardY - 6, 340, 68, 'Améliorer (1 ⭐)', affordable ? COLORS.ground : COLORS.disabled, affordable, () => cb.onUpgrade(), 24),
      );
      if (!affordable) {
        container.add(
          scene.add
            .text(cardX, cardY + 56, 'Il te faut 1 étoile ⭐', { fontFamily: FONT, fontSize: '18px', color: '#a06a2a' })
            .setOrigin(0.5),
        );
      }
    }
  } else {
    const openable = data.unlockReason === null;
    const affordable = data.stars >= 1;
    const enabled = openable && affordable;
    container.add(
      makeButton(scene, cardX, cardY - 6, 340, 68, 'Ouvrir (1 ⭐)', enabled ? COLORS.fairy : COLORS.disabled, enabled, () => cb.onUnlock(), 24),
    );
    const msg = data.unlockReason ?? (affordable ? '' : 'Il te faut 1 étoile ⭐');
    if (msg) {
      container.add(
        scene.add
          .text(cardX, cardY + 56, msg, {
            fontFamily: FONT,
            fontSize: '17px',
            color: '#a06a2a',
            align: 'center',
            wordWrap: { width: cardW - 60 },
          })
          .setOrigin(0.5),
      );
    }
  }

  container.add(
    makeButton(scene, cardX, cardY + cardH / 2 - 44, 160, 48, 'Fermer', COLORS.ink, true, () => cb.onClose(), 18),
  );

  return container;
}
