import Phaser from 'phaser';
import { COLORS, FONT, GAME_WIDTH, GAME_HEIGHT } from '../theme';
import type { MischiefHit } from '../game/economy';
import { makeButton } from '../ui/Button';

interface ResultData {
  stars: number;
  witches: number;
  hits: MischiefHit[];
}

/** Écran de résultat : zone fée (rose) en haut, zone sorcières (violet) en bas. */
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

    // Zone fée : rose, en haut.
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT * 0.25, GAME_WIDTH, GAME_HEIGHT * 0.5, COLORS.fairy);
    // Zone sorcières : violet, en bas.
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT * 0.75, GAME_WIDTH, GAME_HEIGHT * 0.5, COLORS.witch);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT * 0.5, GAME_WIDTH, 6, 0xffffff, 0.7);

    // --- Zone fée ---
    this.add
      .text(GAME_WIDTH / 2, 80, 'La fée ✨', { fontFamily: FONT, fontSize: '40px', color: '#ffffff' })
      .setOrigin(0.5);
    const fairyMsg =
      stars > 0
        ? `+${stars} étoile${stars > 1 ? 's' : ''} pour la fée ⭐`
        : 'Pas d’étoile aujourd’hui…\nLa fée se repose. Demain, on réessaie !';
    this.add
      .text(GAME_WIDTH / 2, 210, fairyMsg, {
        fontFamily: FONT,
        fontSize: '30px',
        color: '#ffffff',
        align: 'center',
        lineSpacing: 6,
        wordWrap: { width: GAME_WIDTH - 160 },
      })
      .setOrigin(0.5);

    // --- Zone sorcières ---
    this.add
      .text(GAME_WIDTH / 2, 500, 'Les sorcières 🌙', { fontFamily: FONT, fontSize: '40px', color: '#ffffff' })
      .setOrigin(0.5);
    this.add
      .text(GAME_WIDTH / 2, 630, this.witchMessage(witches, hits), {
        fontFamily: FONT,
        fontSize: '26px',
        color: '#ffffff',
        align: 'center',
        lineSpacing: 6,
        wordWrap: { width: GAME_WIDTH - 160 },
      })
      .setOrigin(0.5);

    makeButton(this, GAME_WIDTH / 2, 775, 340, 60, 'Retour à la carte', COLORS.ink, true, () =>
      this.scene.start('Forest'),
    );
  }

  private witchMessage(witches: number, hits: MischiefHit[]): string {
    if (witches === 0) {
      return 'Les sorcières n’ont rien pu faire ! Hahah ! 🧙‍♀️';
    }
    const intro =
      witches === 1 ? '1 sorcière est venue et a cassé :' : `${witches} sorcières sont venues et ont cassé :`;
    if (hits.length === 0) {
      return witches === 1
        ? '1 sorcière est venue… mais la forêt était protégée 💛'
        : `${witches} sorcières sont venues… mais la forêt était protégée 💛`;
    }
    const names = hits.map((h) => `${h.name} (niveau ${h.to})`).join('\n');
    return `${intro}\n${names}`;
  }
}
