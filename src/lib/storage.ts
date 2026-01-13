import type { Entry, User } from "./types";

const KEY = "dogTracker:v1";

export type PersistedState = {
  users: User[];
  currentUserId: string | null;
  entries: Entry[];
};

const defaultState: PersistedState = {
  users: [],
  currentUserId: null,
  entries: [],
};

export function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;

    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      currentUserId:
        typeof parsed.currentUserId === "string" ? parsed.currentUserId : null,
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
    };
  } catch {
    return defaultState;
  }
}

export function saveState(state: PersistedState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}
