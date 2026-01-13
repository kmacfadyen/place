import type { User } from "./types";
import { loadState, saveState } from "./storage";

export function createUser(name: string, email: string): User {
  const state = loadState();

  const user: User = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    createdAtISO: new Date().toISOString(),
  };

  const next = {
    ...state,
    users: [user, ...state.users],
    currentUserId: user.id,
  };

  saveState(next);
  return user;
}

export function setCurrentUser(userId: string | null) {
  const state = loadState();
  saveState({ ...state, currentUserId: userId });
}

export function getCurrentUser(): User | null {
  const state = loadState();
  return state.users.find((u) => u.id === state.currentUserId) ?? null;
}
