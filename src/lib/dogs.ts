import type { Dog, DogMemberRole } from "./types";
import { loadState, saveState } from "./storage";

export function listDogsForUser(userId: string): Dog[] {
  const state = loadState();
  const dogIds = new Set(state.dogMembers.filter(m => m.userId === userId).map(m => m.dogId));
  return state.dogs.filter(d => dogIds.has(d.id));
}

export function getActiveDogId(userId: string): string | null {
  const state = loadState();
  return state.activeDogIdByUser[userId] ?? null;
}

export function setActiveDogId(userId: string, dogId: string | null) {
  const state = loadState();
  saveState({
    ...state,
    activeDogIdByUser: { ...state.activeDogIdByUser, [userId]: dogId },
  });
}

export function createDogForUser(input: {
  userId: string;
  name: string;
  breed?: string;
  birthdayISO?: string;
  role?: DogMemberRole;
}): Dog {
  const state = loadState();

  const dog: Dog = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    breed: input.breed?.trim() || "",
    birthdayISO: input.birthdayISO || "",
    createdAtISO: new Date().toISOString(),
  };

  const member = {
    dogId: dog.id,
    userId: input.userId,
    role: input.role ?? "owner",
    createdAtISO: new Date().toISOString(),
  };

  const next = {
    ...state,
    dogs: [dog, ...state.dogs],
    dogMembers: [member, ...state.dogMembers],
    activeDogIdByUser: {
      ...state.activeDogIdByUser,
      [input.userId]: dog.id, // auto-select newly created dog
    },
  };

  saveState(next);
  return dog;
}

/**
 * Sharing approach (local-only):
 * We generate a short "invite code" = dogId.
 * The other user enters it, and we create DogMember link.
 */
export function linkDogToUserByCode(input: { userId: string; dogCode: string; role?: DogMemberRole }):
  | { ok: true }
  | { ok: false; reason: string } {
  const state = loadState();
  const dogId = input.dogCode.trim();

  const dog = state.dogs.find(d => d.id === dogId);
  if (!dog) return { ok: false, reason: "Dog not found for that code." };

  const exists = state.dogMembers.some(m => m.userId === input.userId && m.dogId === dogId);
  if (exists) return { ok: false, reason: "That dog is already linked to your account." };

  const next = {
    ...state,
    dogMembers: [
      {
        dogId,
        userId: input.userId,
        role: input.role ?? "caregiver",
        createdAtISO: new Date().toISOString(),
      },
      ...state.dogMembers,
    ],
    activeDogIdByUser: {
      ...state.activeDogIdByUser,
      [input.userId]: state.activeDogIdByUser[input.userId] ?? dogId,
    },
  };

  saveState(next);
  return { ok: true };
}
