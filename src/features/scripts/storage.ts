import type { PresentationScript } from "./types";

const STORAGE_KEY = "presentation-scripts";

export function loadScripts(): PresentationScript[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    const parsedValue = rawValue ? JSON.parse(rawValue) : [];
    return Array.isArray(parsedValue) ? (parsedValue as PresentationScript[]) : [];
  } catch {
    return [];
  }
}

export function saveScripts(scripts: PresentationScript[]) {
  if (typeof window === "undefined") {
    return true;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts));
    return true;
  } catch {
    return false;
  }
}
