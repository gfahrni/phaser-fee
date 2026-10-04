import Phaser from 'phaser';
import { COLORS, FONT, GAME_WIDTH, GAME_HEIGHT } from '../theme';
import { ELEMENTS, type ElementDef } from '../game/upgrades';
import { isCreated, levelOf, unlockElement, upgradeElement, fairyWins, applyMischiefs } from '../game/economy';
import { canBilan, hasBilanToday, BILAN_HOUR } from '../game/daily';
import { loadState, saveState, resetState } from '../game/storage';
import { isDebugEnabled, isBilanAlwaysOpen, setBilanAlwaysOpen } from '../game/debug';
import type { SaveState } from '../game/types';
import { buildElementArt, buildEmptySpot } from '../ui/elementArt';
import { createUpgradePanel } from '../ui/UpgradePanel';
import { createDebugPanel } from '../ui/DebugPanel';
import { makeButton } from '../ui/Button';

/** La forêt : unique écran de suivi, on voit tout d'un coup d'œil. */
export class ForestScene extends Phaser.Scene {
  private state!: SaveState;
  private elementLayer!: Phaser.GameObjects.Container;
  private starsText!: Phaser.GameObjects.Text;
  private bilanButton?: Phaser.GameObjects.Container;
  private panel?: Phaser.GameObjects.Container;
  private toast?: Phaser.GameObjects.Container;
  private debugPanel?: Phaser.GameObjects.Container;
  private debugEnabled = false;

  constructor() {
    super('Forest');
  }

  create(): void {
    this.debugEnabled = isDebugEnabled();
    this.state = loadState();
    this.drawBackground();
    this.elementLayer = this.add.container(0, 0);
    this.buildElements();
    this.buildHud();
    if (this.debugEnabled) this.buildDebugPanel();
  }

  private drawBackground(): void {
    const horizon = 430;
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.sky);
    this.add.circle(GAME_WIDTH - 140, 130, 70, COLORS.sun, 0.9);
    this.add.ellipse(260, horizon, 900, 300, COLORS.groundDark, 0.5);
    this.add.ellipse(760, horizon + 10, 900, 320, COLORS.groundDark, 0.4);
    this.add.rectangle(GAME_WIDTH / 2, (horizon + GAME_HEIGHT) / 2, GAME_WIDTH, GAME_HEIGHT - horizon, COLORS.ground);
    this.add.rectangle(GAME_WIDTH / 2, horizon, GAME_WIDTH, 30, COLORS.grass);
  }

  private buildElements(): void {
    this.elementLayer.removeAll(true);
    for (const el of ELEMENTS) {
      const created = isCreated(this.state, el.id);
      const level = levelOf(this.state, el.id);
      const slot = this.add.container(el.x, el.y);
      slot.add(created ? buildElementArt(this, el, level) : buildEmptySpot(this));

      const hit = this.add.circle(0, -18, 46, 0xffffff, 0.001).setInteractive({ useHandCursor: true });
      hit.on('pointerdown', () => this.openPanel(el));
      slot.add(hit);

      this.elementLayer.add(slot);
    }
  }

  private buildHud(): void {
    this.add.rectangle(GAME_WIDTH / 2, 44, GAME_WIDTH, 88, 0x000000, 0.16);
    this.starsText = this.add
      .text(28, 44, '', { fontFamily: FONT, fontSize: '30px', color: '#2b3a1f' })
      .setOrigin(0, 0.5);
    this.updateStars();
    this.buildBilanButton();
  }

  private updateStars(): void {
    this.starsText.setText(`⭐ ${this.state.stars}`);
  }

  private bilanForcedOpen(): boolean {
    return this.debugEnabled && isBilanAlwaysOpen();
  }

  private buildBilanButton(): void {
    this.bilanButton?.destroy();
    const now = new Date();
    const force = this.bilanForcedOpen();
    let label: string;
    let color: number = COLORS.disabled;
    if (canBilan(this.state, now, force)) {
      label = 'Bilan du jour ✨';
      color = COLORS.fairy;
    } else if (hasBilanToday(this.state, now)) {
      label = 'Bilan fait ✓';
    } else {
      label = `Bilan à ${BILAN_HOUR}h`;
    }
    this.bilanButton = makeButton(
      this,
      GAME_WIDTH - 130,
      44,
      230,
      56,
      label,
      color,
      true,
      () => this.onBilanClick(),
      18,
    );
  }

  private onBilanClick(): void {
    const now = new Date();
    const force = this.bilanForcedOpen();
    if (canBilan(this.state, now, force)) {
      this.scene.start('Bilan');
    } else if (hasBilanToday(this.state, now)) {
      this.showToast('Le bilan est déjà fait pour aujourd’hui ✅');
    } else {
      this.showToast(`Le bilan s’ouvre à ${BILAN_HOUR}h ✨`);
    }
  }

  private openPanel(el: ElementDef): void {
    if (this.panel) return;
    this.panel = createUpgradePanel(this, el, this.state, {
      onUpgrade: (id) => this.act(() => upgradeElement(this.state, id)),
      onUnlock: (id) => this.act(() => unlockElement(this.state, id)),
      onClose: () => this.closePanel(),
    });
  }

  private act(change: () => SaveState): void {
    const next = change();
    if (next === this.state) return;
    this.state = next;
    saveState(this.state);
    this.closePanel();
    this.buildElements();
    this.updateStars();
    this.buildBilanButton();
  }

  private closePanel(): void {
    this.panel?.destroy();
    this.panel = undefined;
  }

  private buildDebugPanel(): void {
    this.debugPanel?.destroy();
    this.debugPanel = createDebugPanel(this, {
      bilanOpen: isBilanAlwaysOpen(),
      onAddStars: () => this.act(() => ({ ...this.state, stars: this.state.stars + 10 })),
      onFairyWin: () => this.act(() => fairyWins(this.state)),
      onWitchWin: () => this.act(() => applyMischiefs(this.state)),
      onToggleBilan: () => {
        setBilanAlwaysOpen(!isBilanAlwaysOpen());
        this.buildDebugPanel();
        this.buildBilanButton();
      },
      onReset: () => {
        this.state = resetState();
        this.closePanel();
        this.buildElements();
        this.updateStars();
        this.buildBilanButton();
      },
    });
  }

  private showToast(message: string): void {
    this.toast?.destroy();
    const container = this.add.container(GAME_WIDTH / 2, 215).setDepth(2000);
    const text = this.add
      .text(0, 0, message, { fontFamily: FONT, fontSize: '22px', color: '#2b3a1f' })
      .setOrigin(0.5);
    const bg = this.add
      .rectangle(0, 0, text.width + 48, 60, COLORS.panel)
      .setStrokeStyle(4, COLORS.panelStroke);
    container.add([bg, text]);
    this.toast = container;
    this.time.delayedCall(1800, () => {
      container.destroy();
      if (this.toast === container) this.toast = undefined;
    });
  }
}
