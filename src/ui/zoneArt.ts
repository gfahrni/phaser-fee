import Phaser from 'phaser';
import { FONT } from '../theme';
import { ZONE_TILE_SCALE, TIER_COUNT, shade, type ObjectKind, type ZoneDef } from '../game/zones';

const RAINBOW = [0xff6f91, 0xffd447, 0x8fd14f, 0x6fc3ff, 0xb388ff];
const MAX_ITEMS = 50;

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
      const cy = s * 0.45;
      const n = 8;
      const pts: Phaser.Geom.Point[] = [new Phaser.Geom.Point(0, cy)];
      for (let i = 0; i <= n; i++) {
        const a = Math.PI + (Math.PI * i) / n;
        pts.push(new Phaser.Geom.Point(Math.cos(a) * s, cy + Math.sin(a) * s));
      }
      g.fillStyle(color, 1);
      g.fillPoints(pts, true);
      g.lineStyle(Math.max(1, s * 0.08), 0xffffff, 0.5);
      for (let i = 1; i < n; i++) {
        const a = Math.PI + (Math.PI * i) / n;
        g.lineBetween(0, cy, Math.cos(a) * s * 0.92, cy + Math.sin(a) * s * 0.92);
      }
      c.add(g);
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
        const radius = s - i * s * 0.24;
        const pts: Phaser.Geom.Point[] = [];
        const n = 12;
        for (let k = 0; k <= n; k++) {
          const a = Math.PI + (Math.PI * k) / n;
          pts.push(new Phaser.Geom.Point(Math.cos(a) * radius, s * 0.5 + Math.sin(a) * radius));
        }
        g.lineStyle(s * 0.2, RAINBOW[i], 1);
        g.strokePoints(pts, false, false);
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

/** Sommets d'un octogone inscrit dans une boîte w x h (bords plats haut/bas/gauche/droite). */
function octagonPoints(w: number, h: number): Phaser.Geom.Point[] {
  const pts: Phaser.Geom.Point[] = [];
  for (let i = 0; i < 8; i++) {
    const a = Phaser.Math.DegToRad(22.5 + i * 45);
    pts.push(new Phaser.Geom.Point((Math.cos(a) * w) / 2, (Math.sin(a) * h) / 2));
  }
  return pts;
}

/** Hash déterministe (FNV-1a mélangé) pour générer des positions stables. */
function hashSeed(id: string, a: number, b: number): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h = Math.imul(h ^ Math.imul(a + 1, 2654435761), 16777619);
  h = Math.imul(h ^ Math.imul(b + 1, 40503), 16777619);
  return h >>> 0;
}

function rand01(seed: number): number {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

const OCT_COS = 0.9238795; // cos(22.5°)
const OCT_DIAG = 1.3065629; // cos(22.5°) + sin(22.5°)

/**
 * Place `count` points au hasard dans l'octogone, avec un écart minimum.
 * Déterministe : la position du i-ème objet ne change pas quand on en ajoute.
 */
function placePoints(
  zoneId: string,
  count: number,
  halfX: number,
  halfY: number,
  minGap: number,
): Array<{ x: number; y: number }> {
  const margin = 0.9;
  const lim = OCT_COS * margin;
  const diag = OCT_DIAG * margin;
  const placed: Array<{ x: number; y: number }> = [];

  for (let i = 0; i < count; i++) {
    // Repli : centre légèrement aléatoire.
    let px = (rand01(hashSeed(zoneId, i, 7)) * 2 - 1) * halfX * 0.4;
    let py = (rand01(hashSeed(zoneId, i, 8)) * 2 - 1) * halfY * 0.4;

    for (let attempt = 0; attempt < 30; attempt++) {
      const u = (rand01(hashSeed(zoneId, i, attempt * 2)) * 2 - 1) * lim;
      const v = (rand01(hashSeed(zoneId, i, attempt * 2 + 1)) * 2 - 1) * lim;
      if (Math.abs(u) + Math.abs(v) > diag) continue;
      const x = u * halfX;
      const y = v * halfY;
      let ok = true;
      for (const p of placed) {
        const dx = p.x - x;
        const dy = p.y - y;
        if (dx * dx + dy * dy < minGap * minGap) {
          ok = false;
          break;
        }
      }
      if (ok) {
        px = x;
        py = y;
        break;
      }
    }
    placed.push({ x: px, y: py });
  }
  return placed;
}

/** Etat d'affichage d'une région : ouverte, ou « disponible » (cadenas + nom). */
export type ZoneTileMode = 'created' | 'available';

/** Dessine une région : terrain (couleur de palier), objets, monuments, nom, niveau. */
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
  // L'octogone est agrandi, mais les formes gardent leur taille d'origine.
  const ow = w * ZONE_TILE_SCALE;
  const oh = h * ZONE_TILE_SCALE;
  const c = scene.add.container(0, 0);
  const finalColor = shade(zone.base, (TIER_COUNT - 1) * 0.12);

  const bg = scene.add.graphics();
  const oct = octagonPoints(ow, oh);
  bg.fillStyle(finalColor, 0.5);
  bg.lineStyle(4, finalColor, 0.5);
  bg.fillPoints(oct, true);
  bg.strokePoints(oct, true, true);
  c.add(bg);

  // Taille définitive des petites formes (celle du niveau 50), dès le début.
  const maxCols = 8;
  const maxRows = Math.ceil(MAX_ITEMS / maxCols);
  const smallSize = Math.min(w / (maxCols + 0.6), h / (maxRows + 0.6)) * 0.42;

  // Positions aléatoires (mais stables) dans l'octogone, avec un écart minimum.
  const items = Math.max(1, level);
  const points = placePoints(zone.id, items, ow / 2, oh / 2, smallSize * 1.5);
  for (const p of points) {
    c.add(drawObject(scene, zone.objectKind, p.x, p.y, smallSize, zone.accent));
  }

  // Témoins de progrès : une grande forme centrale à 10,
  // puis 4 formes moyennes en carré (20, 30, 40, 50).
  const base = Math.min(w, h);
  if (level >= 10) {
    c.add(drawObject(scene, zone.objectKind, 0, 0, base * 0.2, shade(zone.accent, -0.35)));
  }
  const corners: Array<[number, number]> = [
    [-0.22 * w, -0.22 * h], // 20 : haut-gauche
    [0.22 * w, -0.22 * h], // 30 : haut-droit
    [0.22 * w, 0.22 * h], // 40 : bas-droite
    [-0.22 * w, 0.22 * h], // 50 : bas-gauche
  ];
  corners.forEach(([cx, cy], i) => {
    if (level >= 20 + i * 10) {
      c.add(drawObject(scene, zone.objectKind, cx, cy, base * 0.115, shade(zone.accent, -0.2)));
    }
  });

  return c;
}

function availableTile(scene: Phaser.Scene, zone: ZoneDef): Phaser.GameObjects.Container {
  const { w, h } = zone;
  const ow = w * ZONE_TILE_SCALE;
  const oh = h * ZONE_TILE_SCALE;
  const c = scene.add.container(0, 0);
  const bg = scene.add.graphics();
  const oct = octagonPoints(ow, oh);
  bg.fillStyle(shade(zone.base, (TIER_COUNT - 1) * 0.12), 0.5);
  bg.lineStyle(5, 0xffe27a, 1);
  bg.fillPoints(oct, true);
  bg.strokePoints(oct, true, true);
  c.add(bg);
  c.add(scene.add.text(0, -6, '🔒', { fontSize: '34px' }).setOrigin(0.5));
  return c;
}

/**
 * Nom + badge de niveau (+ « Ouvrir ») dans une couche séparée, dessinée
 * AU-DESSUS de toutes les régions pour qu'aucun label ne soit recouvert.
 */
export function createZoneLabel(
  scene: Phaser.Scene,
  zone: ZoneDef,
  mode: ZoneTileMode,
  level: number,
): Phaser.GameObjects.Container {
  const oh = zone.h * ZONE_TILE_SCALE;
  const c = scene.add.container(0, 0);
  c.add(
    scene.add
      .text(0, -oh / 2 - 15, zone.name, { fontFamily: FONT, fontSize: '15px', color: '#ffffff' })
      .setOrigin(0.5)
      .setShadow(1, 1, '#000000', 3),
  );
  if (mode === 'created') {
    const badge = scene.add.container(0, -oh * 0.462 + 22);
    badge.add(scene.add.circle(0, 0, 20, 0xffffff, 0.5).setStrokeStyle(3, shade(zone.base, -0.3)));
    badge.add(
      scene.add
        .text(0, 0, String(level), { fontFamily: FONT, fontSize: '21px', color: '#2b3a1f' })
        .setOrigin(0.5),
    );
    c.add(badge);
  } else {
    c.add(
      scene.add
        .text(0, oh / 2 - 20, 'Ouvrir (1 ⭐)', { fontFamily: FONT, fontSize: '15px', color: '#2b3a1f' })
        .setOrigin(0.5),
    );
  }
  return c;
}
