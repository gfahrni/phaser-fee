import Phaser from 'phaser';
import { COLORS, FONT, GAME_WIDTH, GAME_HEIGHT } from '../theme';
import { ZONES, zoneById, CASTLE_ID, CASTLE_NAME, type ZoneDef } from '../game/zones';
import {
  isCreated,
  levelOf,
  unlockElement,
  upgradeElement,
  unlockBlockReason,
  fairyWins,
  applyMischiefs,
  setAllLevels,
  unlockAllZones,
} from '../game/economy';
import { canBilan, hasBilanToday, BILAN_HOUR } from '../game/daily';
import { loadState, saveState, resetState } from '../game/storage';
import { isDebugEnabled, isBilanAlwaysOpen, setBilanAlwaysOpen } from '../game/debug';
import type { SaveState } from '../game/types';
import { createZoneTile } from '../ui/zoneArt';
import { createCastle } from '../ui/castleArt';
import { createUpgradePanel } from '../ui/UpgradePanel';
import { createDebugPanel } from '../ui/DebugPanel';
import { makeButton } from '../ui/Button';

const CASTLE_X = 590;
const CASTLE_Y = 445;

/** La carte : le château au centre, les régions autour. */
export class ForestScene extends Phaser.Scene {
  private state!: SaveState;
  private mapLayer!: Phaser.GameObjects.Container;
  private zoneNodes = new Map<string, Phaser.GameObjects.Container>();
  private castleNode?: Phaser.GameObjects.Container;
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
    this.mapLayer = this.add.container(0, 0);
    this.buildMap();
    this.buildHud();
    if (this.debugEnabled) this.buildDebugPanel();
  }

  private drawBackground(): void {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.map);
    const patches: Array<[number, number, number, number, number, number]> = [
      [180, 200, 520, 360, COLORS.mapDark, 0.25],
      [980, 640, 560, 360, COLORS.mapDark, 0.22],
      [980, 180, 460, 300, COLORS.mapDark, 0.18],
      [200, 660, 460, 300, COLORS.mapDark, 0.18],
      [590, 445, 700, 520, 0xffffff, 0.08],
    ];
    for (const [x, y, w, h, c, a] of patches) this.add.ellipse(x, y, w, h, c, a);

    // Petite rivière décorative en haut à gauche.
    const river = this.add.graphics();
    river.lineStyle(18, COLORS.mapWater, 0.5);
    river.beginPath();
    river.moveTo(0, 520);
    river.lineTo(220, 470);
    river.lineTo(430, 520);
    river.strokePath();
  }

  private buildMap(): void {
    this.mapLayer.removeAll(true);
    this.zoneNodes.clear();
    this.castleNode = undefined;
    this.buildCastle();
    for (const zone of ZONES) this.buildZone(zone);
  }

  private buildCastle(): void {
    this.castleNode?.destroy();
    const node = this.add.container(CASTLE_X, CASTLE_Y);
    node.add(createCastle(this, levelOf(this.state, CASTLE_ID)));
    const hit = this.add.circle(0, 0, 112, 0xffffff, 0.001).setInteractive({ useHandCursor: true });
    hit.on('pointerdown', () => this.openPanel(CASTLE_ID));
    node.add(hit);
    this.mapLayer.add(node);
    this.castleNode = node;
  }

  private buildZone(zone: ZoneDef): void {
    this.zoneNodes.get(zone.id)?.destroy();
    const node = this.add.container(zone.x, zone.y);
    node.add(createZoneTile(this, zone, isCreated(this.state, zone.id), levelOf(this.state, zone.id)));
    const hit = this.add
      .rectangle(0, 0, zone.w, zone.h, 0xffffff, 0.001)
      .setInteractive({ useHandCursor: true });
    hit.on('pointerdown', () => this.openPanel(zone.id));
    node.add(hit);
    this.mapLayer.add(node);
    this.zoneNodes.set(zone.id, node);
  }

  private buildHud(): void {
    this.add.rectangle(109, 40, 178, 48, 0xfff7e6, 0.92).setStrokeStyle(3, COLORS.panelStroke);
    this.starsText = this.add
      .text(28, 40, '', { fontFamily: FONT, fontSize: '28px', color: '#2b3a1f' })
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
      GAME_WIDTH - 145,
      44,
      250,
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

  private openPanel(id: string): void {
    if (this.panel) return;
    const isCastle = id === CASTLE_ID;
    const zone = zoneById(id);
    const created = isCreated(this.state, id);
    const level = levelOf(this.state, id);
    const name = isCastle ? CASTLE_NAME : (zone?.name ?? 'Région');
    const subtitle = isCastle
      ? 'Ton château'
      : zone?.ring === 'inner'
        ? 'Région intérieure'
        : 'Région extérieure';
    const unlockReason = !created && !isCastle ? unlockBlockReason(this.state, id) : null;

    this.panel = createUpgradePanel(
      this,
      { name, subtitle, created, level, unlockReason, stars: this.state.stars },
      {
        onUpgrade: () => this.applyChange(() => upgradeElement(this.state, id), id),
        onUnlock: () => this.applyChange(() => unlockElement(this.state, id), id),
        onClose: () => this.closePanel(),
      },
    );
  }

  private applyChange(change: () => SaveState, id?: string): void {
    const next = change();
    if (next === this.state) return;
    this.state = next;
    saveState(this.state);
    this.closePanel();
    if (id === undefined) {
      this.refreshAll();
      return;
    }
    if (id === CASTLE_ID) {
      this.buildCastle();
    } else {
      const zone = zoneById(id);
      if (zone) this.buildZone(zone);
    }
    this.updateStars();
    this.buildBilanButton();
  }

  private refreshAll(): void {
    this.buildMap();
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
      onAddStars: () => this.applyChange(() => ({ ...this.state, stars: this.state.stars + 10 })),
      onFairyWin: () => this.applyChange(() => fairyWins(this.state)),
      onWitchWin: () => this.applyChange(() => applyMischiefs(this.state)),
      onSetAllLevels: (level) => this.applyChange(() => setAllLevels(this.state, level)),
      onUnlockAll: () => this.applyChange(() => unlockAllZones(this.state)),
      onToggleBilan: () => {
        setBilanAlwaysOpen(!isBilanAlwaysOpen());
        this.buildDebugPanel();
        this.buildBilanButton();
      },
      onReset: () => {
        this.state = resetState();
        this.closePanel();
        this.refreshAll();
      },
    });
  }

  private showToast(message: string): void {
    this.toast?.destroy();
    const container = this.add.container(GAME_WIDTH / 2, 120).setDepth(5000);
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
