/**
 * Mode debug : activé automatiquement en développement (`npm run dev`),
 * ou via `?debug` dans l'URL, ou `localStorage.setItem('fee.debug','1')`.
 * Il ajoute un panneau de boutons et permet d'ouvrir le bilan à toute heure.
 */
let overrideBilanOpen: boolean | null = null;
/** Débloqué par le cheat code pendant la session (en plus du flag persistant). */
let cheatUnlocked = false;

export function isDebugEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  if (cheatUnlocked) return true;
  if (import.meta.env.DEV) return true;
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has('debug')) return true;
    return localStorage.getItem('fee.debug') === '1';
  } catch {
    return false;
  }
}

/** Active le debug (cheat code) et le mémorise pour les prochaines ouvertures. */
export function enableDebugPersistent(): void {
  cheatUnlocked = true;
  try {
    localStorage.setItem('fee.debug', '1');
  } catch {
    // ignore
  }
}

/** Désactive le debug (flag persistant + session). */
export function disableDebug(): void {
  cheatUnlocked = false;
  try {
    localStorage.removeItem('fee.debug');
  } catch {
    // ignore
  }
}

/** En debug, le bilan est ouvert par défaut (le bouton permet de tester la règle des 18h). */
export function isBilanAlwaysOpen(): boolean {
  return overrideBilanOpen ?? true;
}

export function setBilanAlwaysOpen(value: boolean): void {
  overrideBilanOpen = value;
}
