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

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (newPassword.length < 6) {
    return { ok: false, reason: "New password must be at least 6 characters." };
  }

  const state = loadState();
  const user = state.users.find((u) => u.id === userId);
  if (!user) return { ok: false, reason: "User not found." };

  const currentHash = await hashPassword(currentPassword);
  if (currentHash !== user.passwordHash) {
    return { ok: false, reason: "Current password is incorrect." };
  }

  const newHash = await hashPassword(newPassword);

  const users = state.users.map((u) =>
    u.id === userId ? { ...u, passwordHash: newHash } : u
  );

  saveState({ ...state, users });

  return { ok: true };
}
