import Phaser from 'phaser';
import { COLORS, FONT, GAME_WIDTH, GAME_HEIGHT } from '../theme';
import type { MischiefHit } from '../game/economy';
import { makeButton } from '../ui/Button';

interface ResultData {
  stars: number;
  witches: number;
  hits: MischiefHit[];
}

/** Écran de résultat après le bilan, puis retour à la carte. */
export class ResultScene extends Phaser.Scene {
  private result: ResultData = { stars: 0, witches: 0, hits: [] };

  constructor() {
    super('Result');
  }

  init(data: Partial<ResultData>): void {
    this.result = { stars: data.stars ?? 0, witches: data.witches ?? 0, hits: data.hits ?? [] };
  }

  create(): void {
    const { stars, witches, hits } = this.result;
    const witchesOnly = witches > 0 && stars === 0;
    const bg = witchesOnly ? COLORS.witch : COLORS.fairy;
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, bg);

    let title: string;
    if (witchesOnly) {
      title = witches > 1 ? `${witches} sorcières sont venues…` : 'Une sorcière est venue…';
    } else if (stars > 0 && witches === 0) {
      title = 'La fée gagne ✨';
    } else if (stars > 0 && witches > 0) {
      title = 'Une journée partagée';
    } else {
      title = 'Journée tranquille';
    }

    this.add
      .text(GAME_WIDTH / 2, 210, title, {
        fontFamily: FONT,
        fontSize: '44px',
        color: '#ffffff',
        align: 'center',
      })
      .setOrigin(0.5);

    const lines: string[] = [];
    if (stars > 0) {
      lines.push(`+${stars} étoile${stars > 1 ? 's' : ''} pour la fée ⭐`);
    }
    if (witches > 0) {
      if (hits.length > 0) {
        const names = hits.map((h) => `${h.name} (niveau ${h.to})`).join('\n');
        lines.push(`Elles ont cassé :\n${names}`);
      } else {
        lines.push('…mais la forêt était protégée 💛');
      }
    }

    this.add
      .text(GAME_WIDTH / 2, 380, lines.join('\n\n'), {
        fontFamily: FONT,
        fontSize: '26px',
        color: '#ffffff',
        align: 'center',
        lineSpacing: 6,
        wordWrap: { width: GAME_WIDTH - 160 },
      })
      .setOrigin(0.5);

    makeButton(this, GAME_WIDTH / 2, 660, 360, 76, 'Retour à la carte', COLORS.ink, true, () =>
      this.scene.start('Forest'),
    );
  }
}
