import Phaser from 'phaser';
import { COLORS, FONT, GAME_WIDTH, GAME_HEIGHT } from '../theme';
import { applyBilan, canBilan } from '../game/daily';
import { loadState, saveState } from '../game/storage';
import { isDebugEnabled, isBilanAlwaysOpen } from '../game/debug';
import { makeButton } from '../ui/Button';

const STAR_COLOR = 0xffb020;

/** Bilan du soir : combien d'étoiles, et combien de sorcières ? (débloqué à 18h). */
export class BilanScene extends Phaser.Scene {
  private stars = 3;
  private witches = 0;
  private content?: Phaser.GameObjects.Container;

  constructor() {
    super('Bilan');
  }

  create(): void {
    const state = loadState();
    const force = isDebugEnabled() && isBilanAlwaysOpen();
    if (!canBilan(state, new Date(), force)) {
      this.scene.start('Forest');
      return;
    }

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.sky);
    this.add
      .text(GAME_WIDTH / 2, 120, 'Le bilan du jour', {
        fontFamily: FONT,
        fontSize: '44px',
        color: '#2b3a1f',
      })
      .setOrigin(0.5);
    this.add
      .text(GAME_WIDTH / 2, 172, 'Combien d’étoiles, et combien de sorcières ?', {
        fontFamily: FONT,
        fontSize: '22px',
        color: '#5a6a3a',
      })
      .setOrigin(0.5);
    this.render();
  }

  private render(): void {
    this.content?.destroy();
    const c = this.add.container(0, 0);
    this.content = c;
    c.add(
      this.selector(360, 320, '⭐ Étoiles pour la fée', this.stars, STAR_COLOR, (v) => {
        this.stars = v;
        this.render();
      }),
    );
    c.add(
      this.selector(360, 470, '🌙 Sorcières méchantes', this.witches, COLORS.witch, (v) => {
        this.witches = v;
        this.render();
      }),
    );
    c.add(
      makeButton(this, GAME_WIDTH / 2, 650, 320, 76, 'Valider', COLORS.ink, true, () => this.validate(), 26),
    );
  }

  private selector(
    x: number,
    y: number,
    label: string,
    value: number,
    color: number,
    onChange: (v: number) => void,
  ): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    c.add(
      this.add.text(0, -60, label, { fontFamily: FONT, fontSize: '26px', color: '#2b3a1f' }).setOrigin(0, 0.5),
    );
    [0, 1, 2, 3].forEach((v, i) => {
      const bx = i * 96;
      const selected = v === value;
      const bg = this.add
        .rectangle(bx, 0, 76, 76, selected ? color : COLORS.disabled)
        .setStrokeStyle(4, 0xffffff, 0.9);
      const t = this.add
        .text(bx, 0, String(v), { fontFamily: FONT, fontSize: '30px', color: '#ffffff' })
        .setOrigin(0.5);
      bg.setInteractive({ useHandCursor: true }).on('pointerdown', () => onChange(v));
      c.add([bg, t]);
    });
    return c;
  }

  private validate(): void {
    const state = loadState();
    const force = isDebugEnabled() && isBilanAlwaysOpen();
    const result = applyBilan(state, this.stars, this.witches, new Date(), Math.random, force);
    if (result.applied) saveState(result.state);
    this.scene.start('Result', { stars: result.stars, witches: result.witches, hits: result.hits });
  }
}
