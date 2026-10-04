import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './theme';
import { BootScene } from './scenes/BootScene';
import { ForestScene } from './scenes/ForestScene';
import { BilanScene } from './scenes/BilanScene';
import { ResultScene } from './scenes/ResultScene';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#bfe6ff',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, ForestScene, BilanScene, ResultScene],
});
