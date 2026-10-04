import Phaser from 'phaser';
import { FONT } from '../theme';
import { CASTLE_NAME } from '../game/zones';

/**
 * Château vu du dessus : une tour centrale + 4 tours (N, E, S, O).
 * Niveaux 1-10 : la tour centrale. Niveaux 11-50 : les 4 tours, 10 niveaux chacune.
 */
export function createCastle(scene: Phaser.Scene, level: number): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);

  c.add(scene.add.circle(3, 4, 106, 0x6f6a5e, 0.5));
  c.add(scene.add.circle(0, 0, 104, 0x9a9488));
  c.add(scene.add.circle(0, 0, 96, 0xcfc9bd));

  const dirs = [
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
  ];
  dirs.forEach((d, i) => {
    const tl = Math.max(0, Math.min(10, level - 10 * (i + 1)));
    if (tl <= 0) return;
    const dist = 62 + tl * 1.2;
    const x = d.dx * dist;
    const y = d.dy * dist;
    const r = 13 + tl * 1.5;
    c.add(scene.add.circle(x + 3, y + 3, r, 0x7a7468, 0.5));
    c.add(scene.add.circle(x, y, r, 0xddd7c9).setStrokeStyle(3, 0x9a9488));
    c.add(scene.add.circle(x, y, r * 0.6, 0xc94f8c));
    if (tl >= 5) {
      const fg = scene.add.graphics();
      fg.fillStyle(0xffd447, 1);
      fg.fillTriangle(x, y - r, x, y - r - 14, x + 12, y - r - 7);
      c.add(fg);
    }
  });

  const central = Math.max(1, Math.min(10, level));
  const cr = 30 + central * 3;
  c.add(scene.add.circle(0, 0, cr, 0xddd7c9).setStrokeStyle(4, 0x9a9488));
  c.add(scene.add.circle(0, 0, cr * 0.62, 0xc94f8c));

  const battlements = scene.add.graphics();
  battlements.fillStyle(0xddd7c9, 1);
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * 2 * i) / 8;
    battlements.fillRect(Math.cos(a) * cr - 4, Math.sin(a) * cr - 4, 8, 8);
  }
  c.add(battlements);

  const flag = scene.add.graphics();
  flag.fillStyle(0xffd447, 1);
  flag.fillTriangle(0, -cr, 0, -cr - 20, 16, -cr - 10);
  c.add(flag);

  const badge = scene.add.container(cr + 8, -cr - 8);
  badge.add(scene.add.circle(0, 0, 24, 0xffffff, 0.95).setStrokeStyle(3, 0x8f2f66));
  badge.add(
    scene.add
      .text(0, 0, String(level), { fontFamily: FONT, fontSize: '24px', color: '#2b3a1f' })
      .setOrigin(0.5),
  );
  c.add(badge);

  c.add(
    scene.add
      .text(0, -134, CASTLE_NAME, { fontFamily: FONT, fontSize: '17px', color: '#ffffff' })
      .setOrigin(0.5)
      .setShadow(1, 1, '#000000', 3),
  );

  return c;
}
