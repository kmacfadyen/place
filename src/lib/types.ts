export type EntryTypeId =
  | "walk"
  | "vet"
  | "treats"
  | "food"
  | "grooming"
  | "meds"
  | "training"
  | "other";

export type Entry = {
  id: string;
  typeId: EntryTypeId;
  dateISO: string;
  notes?: string;
  cost?: string;
  createdAtISO: string;
};

export const ENTRY_TYPES: { id: EntryTypeId; label: string }[] = [
  { id: "walk", label: "Walk" },
  { id: "vet", label: "Vet" },
  { id: "treats", label: "Treats" },
  { id: "food", label: "Food" },
  { id: "grooming", label: "Grooming" },
  { id: "meds", label: "Medication" },
  { id: "training", label: "Training" },
  { id: "other", label: "Other" },
];

export type MakeEntryInput = {
  typeId: EntryTypeId;
  dateISO: string;
  notes?: string;
  cost?: string;
};

export function makeEntry(input: MakeEntryInput): Entry {
  return {
    id: crypto.randomUUID(),
    typeId: input.typeId,
    dateISO: input.dateISO,
    notes: input.notes ?? "",
    cost: input.cost ?? "",
    createdAtISO: new Date().toISOString(),
  };
}
