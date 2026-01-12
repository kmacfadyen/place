/** import type { Entry } from "./types";

const KEY = "dogTracker:v1";

export type PersistedState = {
  entries: Entry[];
};

export function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { entries: [] };
    const parsed = JSON.parse(raw);
    return {
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
    };
  } catch {
    return { entries: [] };
  }
}

export function saveState(state: PersistedState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}
  */

import type { Entry } from "./types";

const KEY = "dogTracker:v1";

export type PersistedState = {
  entries: Entry[];
};

export function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { entries: [] };

    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "entries" in parsed &&
      Array.isArray((parsed as any).entries)
    ) {
      return { entries: (parsed as any).entries as Entry[] };
    }

    return { entries: [] };
  } catch {
    return { entries: [] };
  }
}

export function saveState(state: PersistedState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}
