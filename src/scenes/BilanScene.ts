import Phaser from 'phaser';
import { COLORS, FONT, GAME_WIDTH, GAME_HEIGHT } from '../theme';
import { applyBilan, canBilan, type BilanChoice } from '../game/daily';
import { loadState, saveState } from '../game/storage';

interface CardDef {
  choice: BilanChoice;
  title: string;
  color: number;
  keywords: string[];
}

const CARDS: CardDef[] = [
  {
    choice: 'fee',
    title: 'Fée ✨',
    color: COLORS.fairy,
    keywords: ['douce', 'courageuse', 'aidante', 'calme'],
  },
  {
    choice: 'sorciere',
    title: 'Sorcière 🌙',
    color: COLORS.witch,
    keywords: ['en colère', 'disputes', 'bouderie', 'caprices'],
  },
];

/** Bilan du soir : on choisit fée ou sorcière (débloqué à partir de 18h). */
export class BilanScene extends Phaser.Scene {
  constructor() {
    super('Bilan');
  }

  create(): void {
    const state = loadState();
    if (!canBilan(state)) {
      this.scene.start('Forest');
      return;
    }

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.sky);
    this.add
      .text(GAME_WIDTH / 2, 110, 'Aujourd’hui, tu as plutôt été…', {
        fontFamily: FONT,
        fontSize: '32px',
        color: '#2b3a1f',
        align: 'center',
        wordWrap: { width: GAME_WIDTH - 80 },
      })
      .setOrigin(0.5);

    CARDS.forEach((card, i) => {
      const x = GAME_WIDTH / 2 + (i === 0 ? -1 : 1) * 200;
      this.buildCard(x, 440, card);
    });
  }

  private buildCard(x: number, y: number, card: CardDef): void {
    const container = this.add.container(x, y);
    const w = 300;
    const h = 420;

    const bg = this.add
      .rectangle(0, 0, w, h, card.color)
      .setStrokeStyle(6, 0xffffff, 0.85)
      .setInteractive({ useHandCursor: true });
    const title = this.add
      .text(0, -h / 2 + 56, card.title, {
        fontFamily: FONT,
        fontSize: '34px',
        color: '#ffffff',
      })
      .setOrigin(0.5);
    container.add([bg, title]);

    card.keywords.forEach((word, i) => {
      const kw = this.add
        .text(0, -30 + i * 60, word, {
          fontFamily: FONT,
          fontSize: '26px',
          color: '#ffffff',
        })
        .setOrigin(0.5);
      container.add(kw);
    });

    bg.on('pointerdown', () => this.choose(card.choice));
  }

  private choose(choice: BilanChoice): void {
    const state = loadState();
    const next = applyBilan(state, choice);
    if (next !== state) saveState(next);
    this.scene.start('Result', { choice });
  }
}
