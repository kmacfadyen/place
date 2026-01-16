import type { User } from "./types";
import { hashPassword } from "./crypto";
import { loadState, saveState } from "./storage";

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

export function deleteUser(userId: string): void {
  const state = loadState();

  const users = state.users.filter((u) => u.id !== userId);
  const entries = state.entries.filter((e) => e.userId !== userId);

  const currentUserId =
    state.currentUserId === userId ? null : state.currentUserId;

  saveState({
    ...state,
    users,
    entries,
    currentUserId,
  });
}
