import Phaser from 'phaser';
import { COLORS, FONT, GAME_WIDTH, GAME_HEIGHT } from '../theme';
import type { BilanChoice } from '../game/daily';
import { makeButton } from '../ui/Button';

/** Écran de résultat après le bilan, puis retour à la forêt. */
export class ResultScene extends Phaser.Scene {
  private choice: BilanChoice = 'fee';

  constructor() {
    super('Result');
  }

  init(data: { choice?: BilanChoice }): void {
    this.choice = data?.choice ?? 'fee';
  }

  create(): void {
    const feeWins = this.choice === 'fee';
    const bg = feeWins ? COLORS.fairy : COLORS.witch;
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, bg);

    const title = feeWins ? 'La fée gagne ✨' : 'La sorcière gagne…';
    const message = feeWins
      ? 'La forêt brille ! Tu gagnes 3 étoiles ⭐'
      : 'Elle a abîmé 2 éléments.\nMais demain est un nouveau jour 💛';

    this.add
      .text(GAME_WIDTH / 2, 320, title, {
        fontFamily: FONT,
        fontSize: '46px',
        color: '#ffffff',
        align: 'center',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 470, message, {
        fontFamily: FONT,
        fontSize: '30px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: GAME_WIDTH - 120 },
      })
      .setOrigin(0.5);

    const btn = makeButton(
      this,
      GAME_WIDTH / 2,
      740,
      360,
      76,
      'Retour à la forêt',
      COLORS.ink,
      true,
      () => this.scene.start('Forest'),
      28,
    );
    this.add.existing(btn);
  }
}
