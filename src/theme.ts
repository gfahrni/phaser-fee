/** Palette et police centralisées, pour tout restyler d'un seul endroit. */
export const COLORS = {
  sky: 0xbfe6ff,
  skyTop: 0x8fd0ff,
  sun: 0xffe9a8,
  ground: 0x7fbf5a,
  groundDark: 0x5a9a3d,
  grass: 0x9ed96a,
  star: 0xffd447,
  ink: 0x2b3a1f,
  panel: 0xfff7e6,
  panelStroke: 0xc9a227,
  fairy: 0xff7fc8,
  fairySoft: 0xffe27a,
  witch: 0x4b2a6b,
  witchLight: 0x7d4fb0,
  witchAcid: 0x8fd14f,
  disabled: 0x9aa08f,
  card: 0xffffff,
} as const;

/** Police ronde, avec repli système si la police n'est pas disponible. */
export const FONT = '"Fredoka", "Baloo 2", "Trebuchet MS", system-ui, sans-serif';

/** Résolution de design (portrait iPad). */
export const GAME_WIDTH = 768;
export const GAME_HEIGHT = 1024;
