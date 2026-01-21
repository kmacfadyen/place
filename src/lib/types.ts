export type EntryTypeId =
  | "walk"
  | "vet"
  | "daycare"
  | "treats"
  | "food"
  | "grooming"
  | "meds"
  | "training"
  | "other";

  export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAtISO: string;
};

export type Dog = {
  id: string;
  name: string;
  breed?: string;
  birthdayISO?: string;
  createdAtISO: string;
};

export type DogMemberRole = "owner" | "caregiver";

export type DogMember = {
  dogId: string;
  userId: string;
  role: DogMemberRole;
  createdAtISO: string;
};


export type Entry = {
  id: string;
  userId: string;
  dogId: string;
  typeId: EntryTypeId;
  dateISO: string;
  notes?: string;
  cost?: string;
  createdAtISO: string;
};

export const ENTRY_TYPES: { id: EntryTypeId; label: string }[] = [
  { id: "walk", label: "Walk" },
  { id: "vet", label: "Vet" },
  { id: "daycare", label: "Daycare" },
  { id: "treats", label: "Treats" },
  { id: "food", label: "Food" },
  { id: "grooming", label: "Grooming" },
  { id: "meds", label: "Medication" },
  { id: "training", label: "Training" },
  { id: "other", label: "Other" },
];

export type MakeEntryInput = {
  userId: string;
  dogId: string;
  typeId: EntryTypeId;
  dateISO: string;
  notes?: string;
  cost?: string;
};

export function makeEntry(input: MakeEntryInput): Entry {
  return {
    id: crypto.randomUUID(),
    userId: input.userId,
    dogId: input.dogId,
    typeId: input.typeId,
    dateISO: input.dateISO,
    notes: input.notes ?? "",
    cost: input.cost ?? "",
    createdAtISO: new Date().toISOString(),
  };
}
