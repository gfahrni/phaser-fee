/**
 * Mode debug : activé automatiquement en développement (`npm run dev`),
 * ou via `?debug` dans l'URL, ou `localStorage.setItem('fee.debug','1')`.
 * Il ajoute un panneau de boutons et permet d'ouvrir le bilan à toute heure.
 */
let overrideBilanOpen: boolean | null = null;

export function isDebugEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  if (import.meta.env.DEV) return true;
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has('debug')) return true;
    return localStorage.getItem('fee.debug') === '1';
  } catch {
    return false;
  }
}

/** En debug, le bilan est ouvert par défaut (le bouton permet de tester la règle des 18h). */
export function isBilanAlwaysOpen(): boolean {
  return overrideBilanOpen ?? true;
}

export function setBilanAlwaysOpen(value: boolean): void {
  overrideBilanOpen = value;
}
