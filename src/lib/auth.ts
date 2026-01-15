import type { User } from "./types";
import { loadState, saveState } from "./storage";
import { hashPassword } from "./crypto";

export async function createUser(name: string, email: string, password: string): Promise<User> {
  const state = loadState();

  const user: User = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: await hashPassword(password),
    createdAtISO: new Date().toISOString(),
  };

  saveState({
    ...state,
    users: [user, ...state.users],
    currentUserId: user.id,
  });

  return user;
}

export function setCurrentUser(userId: string | null) {
  const state = loadState();
  saveState({ ...state, currentUserId: userId });
}

export async function verifyUserPassword(userId: string, password: string): Promise<boolean> {
  const state = loadState();
  const user = state.users.find((u) => u.id === userId);
  if (!user) return false;

  const attemptedHash = await hashPassword(password);
  return attemptedHash === user.passwordHash;
}
