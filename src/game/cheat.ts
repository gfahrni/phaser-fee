import { enableDebugPersistent } from './debug';

/**
 * Cheat code pour activer le mode debug :
 *   Bilan x3  →  Château x3  →  Bilan x3
 * (chaque « château » = ouvrir le panneau du château puis le fermer)
 */
const SEQUENCE: Array<'b' | 'c'> = ['b', 'b', 'b', 'c', 'c', 'c', 'b', 'b', 'b'];

let progress = 0;

function handle(kind: 'b' | 'c'): boolean {
  const expected = SEQUENCE[progress];
  if (kind === expected) {
    progress += 1;
  } else {
    progress = kind === SEQUENCE[0] ? 1 : 0;
  }
  if (progress === SEQUENCE.length) {
    progress = 0;
    enableDebugPersistent();
    return true;
  }
  return false;
}

/** Tap sur le bouton Bilan. Renvoie true si le cheat vient de débloquer le debug. */
export function cheatBilanTap(): boolean {
  return handle('b');
}

/** Tap sur le château (ouverture du panneau). */
export function cheatCastleTap(): boolean {
  return handle('c');
}
