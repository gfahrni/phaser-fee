import Phaser from 'phaser';
import { tierForLevel, type ElementDef } from '../game/upgrades';

/**
 * Dessine un élément de la forêt, placeholders vectoriels.
 * L'apparence grandit avec le palier (niveau 1..50 → palier 1..5).
 * Le point (0,0) du conteneur est le pied de l'élément (posé au sol).
 */
export function buildElementArt(
  scene: Phaser.Scene,
  el: ElementDef,
  level: number,
): Phaser.GameObjects.Container {
  const tier = tierForLevel(level);
  const c = scene.add.container(0, 0);

  switch (el.kind) {
    case 'tree': {
      const trunkH = 22 + tier * 6;
      c.add(scene.add.rectangle(0, -trunkH / 2, 8 + tier * 1.5, trunkH, 0x8a5a3b));
      const r = 14 + tier * 5;
      const topY = -trunkH;
      c.add(scene.add.circle(-r * 0.7, topY, r, el.color));
      c.add(scene.add.circle(r * 0.7, topY, r, el.color));
      c.add(scene.add.circle(0, topY - r * 0.6, r, el.color));
      break;
    }
    case 'flower': {
      const h = 16 + tier * 4;
      c.add(scene.add.rectangle(0, -h / 2, 3, h, 0x4c9a2a));
      const petals = 5 + tier;
      const pr = 3 + tier * 1.6;
      for (let i = 0; i < petals; i++) {
        const a = (Math.PI * 2 * i) / petals;
        c.add(scene.add.circle(Math.cos(a) * pr * 1.6, -h + Math.sin(a) * pr * 1.6, pr, el.color));
      }
      c.add(scene.add.circle(0, -h, pr, 0xffd447));
      break;
    }
    case 'bush': {
      const r = 10 + tier * 4;
      c.add(scene.add.circle(-r, 0, r, el.color));
      c.add(scene.add.circle(r, 0, r, el.color));
      c.add(scene.add.circle(0, -r * 0.6, r * 1.2, el.color));
      break;
    }
    case 'moss': {
      const n = 3 + tier;
      for (let i = 0; i < n; i++) {
        const x = (i - (n - 1) / 2) * (14 + tier * 2);
        c.add(scene.add.ellipse(x, 0, 26 + tier * 6, 14 + tier * 3, el.color));
      }
      break;
    }
    case 'water': {
      const w = 40 + tier * 14;
      const h = 18 + tier * 5;
      c.add(scene.add.ellipse(0, 0, w, h, el.color));
      c.add(scene.add.ellipse(0, 0, w * 0.6, h * 0.5, 0xffffff, 0.35));
      break;
    }
    case 'building': {
      const w = 46 + tier * 10;
      const h = 34 + tier * 8;
      c.add(scene.add.rectangle(0, -h / 2, w, h, el.color));
      const roof = scene.add.graphics();
      roof.fillStyle(0x8a4b2a, 1);
      roof.fillTriangle(-w / 2 - 6, -h, w / 2 + 6, -h, 0, -h - 16 - tier * 4);
      c.add(roof);
      c.add(scene.add.rectangle(0, -h * 0.35, 12, 18, 0x6b4226));
      break;
    }
    case 'mushroom': {
      const h = 14 + tier * 5;
      c.add(scene.add.rectangle(0, -h / 2, 8 + tier * 2, h, 0xf5e6c8));
      c.add(scene.add.ellipse(0, -h, 30 + tier * 10, 18 + tier * 6, el.color));
      c.add(scene.add.circle(-6, -h - 2, 2 + tier, 0xfff3d0));
      c.add(scene.add.circle(7, -h + 1, 2 + tier, 0xfff3d0));
      break;
    }
    case 'light': {
      const n = 3 + tier * 2;
      const rad = 16 + tier * 8;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const x = Math.cos(a) * rad;
        const y = Math.sin(a) * rad * 0.6;
        c.add(scene.add.circle(x, y, 7 + tier * 2.5, el.color, 0.2));
        c.add(scene.add.circle(x, y, 3 + tier * 1.5, el.color, 0.95));
      }
      break;
    }
    case 'arch': {
      const h = 60 + tier * 12;
      const pw = 12 + tier * 2;
      const off = 40 + tier * 4;
      c.add(scene.add.rectangle(-off, -h / 2, pw, h, el.color));
      c.add(scene.add.rectangle(off, -h / 2, pw, h, el.color));
      c.add(scene.add.rectangle(0, -h - pw / 2, off * 2 + pw, pw, el.color));
      break;
    }
    case 'magic': {
      const r = 22 + tier * 7;
      const ring = scene.add.graphics();
      ring.lineStyle(3 + tier, el.color, 0.9);
      ring.strokeCircle(0, -r * 0.4, r);
      c.add(ring);
      c.add(scene.add.star(0, -r * 0.4, 5, r * 0.25, r * 0.6, 0xffffff, 0.9));
      break;
    }
  }
  return c;
}

/** Emplacement vide : un petit repère discret avec un « + ». */
export function buildEmptySpot(scene: Phaser.Scene): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  const g = scene.add.graphics();
  g.lineStyle(3, 0xffffff, 0.55);
  g.strokeCircle(0, -10, 24);
  g.lineBetween(-10, -10, 10, -10);
  g.lineBetween(0, -20, 0, 0);
  c.add(g);
  return c;
}
