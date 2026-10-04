import Phaser from 'phaser';
import { FONT } from '../theme';
import { shade, tierForLevel, type ObjectKind, type ZoneDef } from '../game/zones';

const RAINBOW = [0xff6f91, 0xffd447, 0x8fd14f, 0x6fc3ff, 0xb388ff];

/**
 * Dessine un petit objet d'une région, centré en (x, y), de « rayon » s.
 * Les formes sont volontairement simples (vectoriel).
 */
function drawObject(
  scene: Phaser.Scene,
  kind: ObjectKind,
  x: number,
  y: number,
  s: number,
  color: number,
): Phaser.GameObjects.Container {
  const c = scene.add.container(x, y);

  switch (kind) {
    case 'tree': {
      c.add(scene.add.rectangle(0, s * 0.55, s * 0.32, s, 0x8a5a3b));
      c.add(scene.add.circle(0, -s * 0.1, s * 0.85, color));
      break;
    }
    case 'flower': {
      const pr = s * 0.5;
      for (let i = 0; i < 5; i++) {
        const a = (Math.PI * 2 * i) / 5;
        c.add(scene.add.circle(Math.cos(a) * pr * 1.1, Math.sin(a) * pr * 1.1, pr * 0.7, color));
      }
      c.add(scene.add.circle(0, 0, pr * 0.6, 0xffd447));
      break;
    }
    case 'mushroom': {
      c.add(scene.add.rectangle(0, s * 0.45, s * 0.35, s * 0.85, 0xf5e6c8));
      c.add(scene.add.ellipse(0, -s * 0.1, s * 1.5, s * 0.95, color));
      break;
    }
    case 'light': {
      c.add(scene.add.circle(0, 0, s * 0.95, color, 0.22));
      c.add(scene.add.circle(0, 0, s * 0.42, color, 0.95));
      break;
    }
    case 'unicorn': {
      c.add(scene.add.ellipse(0, 0, s * 1.5, s * 0.85, color));
      c.add(scene.add.circle(-s * 0.72, -s * 0.34, s * 0.42, color));
      const horn = scene.add.graphics();
      horn.fillStyle(0xffd447, 1);
      horn.fillTriangle(-s * 0.72, -s * 0.7, -s * 0.55, -s * 1.15, -s * 0.4, -s * 0.7);
      c.add(horn);
      break;
    }
    case 'crystal': {
      const g = scene.add.graphics();
      g.fillStyle(color, 1);
      g.fillPoints(
        [
          new Phaser.Geom.Point(0, -s),
          new Phaser.Geom.Point(s * 0.6, 0),
          new Phaser.Geom.Point(0, s),
          new Phaser.Geom.Point(-s * 0.6, 0),
        ],
        true,
      );
      c.add(g);
      break;
    }
    case 'shell': {
      const g = scene.add.graphics();
      g.fillStyle(color, 1);
      g.slice(0, 0, s, Phaser.Math.DegToRad(180), Phaser.Math.DegToRad(360), false);
      g.fillPath();
      break;
    }
    case 'palm': {
      c.add(scene.add.rectangle(0, s * 0.4, s * 0.3, s * 1.3, 0x8a5a3b));
      for (let i = 0; i < 4; i++) {
        const a = -Math.PI / 2 + (i - 1.5) * 0.7;
        const frond = scene.add.ellipse(Math.cos(a) * s * 0.7, -s * 0.3 + Math.sin(a) * s * 0.5, s * 1.2, s * 0.4, 0x4caf50);
        frond.setRotation(a);
        c.add(frond);
      }
      break;
    }
    case 'rainbow': {
      const g = scene.add.graphics();
      for (let i = 0; i < RAINBOW.length; i++) {
        g.lineStyle(s * 0.24, RAINBOW[i], 1);
        g.beginPath();
        g.arc(0, s * 0.5, s - i * s * 0.24, Math.PI, Math.PI * 2);
        g.strokePath();
      }
      c.add(g);
      break;
    }
    case 'butterfly': {
      c.add(scene.add.ellipse(-s * 0.42, -s * 0.05, s * 0.95, s * 1.15, color));
      c.add(scene.add.ellipse(s * 0.42, -s * 0.05, s * 0.95, s * 1.15, color));
      c.add(scene.add.rectangle(0, 0, s * 0.14, s * 1.1, 0x333333));
      break;
    }
    case 'bunny': {
      c.add(scene.add.circle(0, s * 0.2, s * 0.7, color));
      c.add(scene.add.ellipse(-s * 0.25, -s * 0.7, s * 0.3, s * 0.8, color));
      c.add(scene.add.ellipse(s * 0.25, -s * 0.7, s * 0.3, s * 0.8, color));
      break;
    }
    case 'candy': {
      c.add(scene.add.circle(0, 0, s * 0.65, color));
      const wrap = scene.add.graphics();
      wrap.fillStyle(color, 1);
      wrap.fillTriangle(-s * 0.6, 0, -s * 1.1, -s * 0.45, -s * 1.1, s * 0.45);
      wrap.fillTriangle(s * 0.6, 0, s * 1.1, -s * 0.45, s * 1.1, s * 0.45);
      c.add(wrap);
      break;
    }
  }
  return c;
}

/** Etat d'affichage d'une région : ouverte, ou « disponible » (cadenas + nom). */
export type ZoneTileMode = 'created' | 'available';

/** Dessine une région : terrain (couleur de palier), objets, monument, nom, niveau. */
export function createZoneTile(
  scene: Phaser.Scene,
  zone: ZoneDef,
  mode: ZoneTileMode,
  level: number,
): Phaser.GameObjects.Container {
  return mode === 'created' ? createdTile(scene, zone, level) : availableTile(scene, zone);
}

function createdTile(scene: Phaser.Scene, zone: ZoneDef, level: number): Phaser.GameObjects.Container {
  const { w, h } = zone;
  const c = scene.add.container(0, 0);
  const tier = tierForLevel(level);

  const bg = scene.add.rectangle(0, 0, w, h, shade(zone.base, (tier - 1) * 0.12)).setStrokeStyle(4, shade(zone.base, -0.25));
  c.add(bg);

  const items = Math.max(1, level);
  const cols = Math.min(8, items);
  const rows = Math.ceil(items / 8);
  const stepX = w / (cols + 0.6);
  const stepY = h / (rows + 0.6);
  const size = Math.min(stepX, stepY) * 0.42;

  for (let i = 0; i < items; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = (col - (cols - 1) / 2) * stepX;
    const y = (row - (rows - 1) / 2) * stepY;
    c.add(drawObject(scene, zone.objectKind, x, y, size, zone.accent));
  }

  // Palier ≥ 3 : un « monument » apparaît (vrai progrès visuel).
  if (tier >= 3) {
    c.add(drawObject(scene, zone.objectKind, 0, 0, Math.min(w, h) * 0.2, shade(zone.accent, -0.35)));
  }

  c.add(
    scene.add
      .text(0, -h / 2 - 15, zone.name, { fontFamily: FONT, fontSize: '15px', color: '#ffffff' })
      .setOrigin(0.5)
      .setShadow(1, 1, '#000000', 3),
  );
  c.add(makeLevelBadge(scene, zone, level));
  return c;
}

function availableTile(scene: Phaser.Scene, zone: ZoneDef): Phaser.GameObjects.Container {
  const { w, h } = zone;
  const c = scene.add.container(0, 0);
  c.add(scene.add.rectangle(0, 0, w, h, zone.base, 0.5).setStrokeStyle(5, 0xffe27a));
  c.add(scene.add.text(0, -6, '🔒', { fontSize: '34px' }).setOrigin(0.5));
  c.add(
    scene.add
      .text(0, -h / 2 - 15, zone.name, { fontFamily: FONT, fontSize: '15px', color: '#ffffff' })
      .setOrigin(0.5)
      .setShadow(1, 1, '#000000', 3),
  );
  c.add(
    scene.add
      .text(0, h / 2 - 20, 'Ouvrir (1 ⭐)', { fontFamily: FONT, fontSize: '15px', color: '#2b3a1f' })
      .setOrigin(0.5),
  );
  return c;
}

function makeLevelBadge(scene: Phaser.Scene, zone: ZoneDef, level: number): Phaser.GameObjects.Container {
  const badge = scene.add.container(zone.w / 2 - 8, -zone.h / 2 + 8);
  badge.add(scene.add.circle(0, 0, 22, 0xffffff, 0.95).setStrokeStyle(3, shade(zone.base, -0.3)));
  badge.add(
    scene.add
      .text(0, 0, String(level), { fontFamily: FONT, fontSize: '22px', color: '#2b3a1f' })
      .setOrigin(0.5),
  );
  return badge;
}
