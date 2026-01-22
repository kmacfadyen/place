import { useMemo, useState } from "react";
import { ENTRY_TYPES, makeEntry } from "../lib/types";
import type { Entry, EntryTypeId } from "../lib/types";

type EntryFormProps = {
  userId: string;
  dogId: string;
  onAdd: (entry: Entry) => void;
};


function nowLocalInputValue(): string {
  // datetime-local expects "YYYY-MM-DDTHH:mm"
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function EntryForm({ userId, dogId, onAdd }: EntryFormProps) {
  const defaultType = useMemo<EntryTypeId>(() => ENTRY_TYPES[0]?.id ?? "walk", []);
  const [typeId, setTypeId] = useState<EntryTypeId>(defaultType);
  const [dateLocal, setDateLocal] = useState<string>(nowLocalInputValue());
  const [notes, setNotes] = useState<string>("");
  const [cost, setCost] = useState<string>("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const dateISO = new Date(dateLocal).toISOString();
    const entry = makeEntry({
      userId,
      dogId,
      typeId,
      dateISO,
      notes: notes.trim(),
      cost: cost.trim(),
    });

    onAdd(entry);

    setNotes("");
    setCost("");
    setTypeId(defaultType);
    setDateLocal(nowLocalInputValue());
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: 12,
        padding: 16,
        border: "1px solid #ddd",
        borderRadius: 12,
      }}
    >
      <h2 style={{ margin: 0 }}>Add a log</h2>

      <label style={{ display: "grid", gap: 6 }}>
        Type
        <select value={typeId} onChange={(e) => setTypeId(e.target.value as EntryTypeId)}>
          {ENTRY_TYPES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        Date / time
        <input
          type="datetime-local"
          value={dateLocal}
          onChange={(e) => setDateLocal(e.target.value)}
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        Notes
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="e.g., 30 min loop around the park"
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        Cost (optional)
        <input
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          placeholder="e.g., 45.00"
        />
      </label>

      <button type="submit">Add entry</button>
    </form>
  );
}
