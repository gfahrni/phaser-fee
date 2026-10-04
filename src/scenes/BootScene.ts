import Phaser from 'phaser';

/** Scène de démarrage : pour l'instant, on file directement à la forêt. */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create(): void {
    this.scene.start('Forest');
  }
}
