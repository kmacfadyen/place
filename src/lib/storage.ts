import type { Entry, User, Dog, DogMember } from "./types";

const KEY = "dogTracker:v1";

export type PersistedState = {
  users: User[];
  currentUserId: string | null;
  entries: Entry[];

  dogs: Dog[];
  dogMembers: DogMember[];

  activeDogIdByUser: Record<string, string | null>;
};

const defaultState: PersistedState = {
  users: [],
  currentUserId: null,
  entries: [],
  dogs: [],
  dogMembers: [],
  activeDogIdByUser: {},
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

      dogs: Array.isArray(parsed.dogs) ? parsed.dogs : [],
      dogMembers: Array.isArray(parsed.dogMembers) ? parsed.dogMembers : [],
      activeDogIdByUser:
      parsed.activeDogIdByUser && typeof parsed.activeDogIdByUser === "object"
      ? (parsed.activeDogIdByUser as Record<string, string | null>)
      : {},
    };
  } catch {
    return defaultState;
  }
}

export function saveState(state: PersistedState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}
