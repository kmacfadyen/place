import { ENTRY_TYPES } from "../lib/types";
import type { Entry, EntryTypeId } from "../lib/types";

type EntryListProps = {
  entries: Entry[];
  onDelete: (id: string) => void;
};

const typeLabel = (typeId: EntryTypeId) =>
  ENTRY_TYPES.find((t) => t.id === typeId)?.label ?? typeId;

export default function EntryList({ entries, onDelete }: EntryListProps) {
  if (entries.length === 0) {
    return <p style={{ opacity: 0.7 }}>No entries yet. Add your first one above.</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
      {entries.map((e) => (
        <li key={e.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700 }}>{typeLabel(e.typeId)}</div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>
                {new Date(e.dateISO).toLocaleString()}
                {e.cost ? ` • $${e.cost}` : ""}
              </div>
              {e.notes ? <div style={{ marginTop: 8 }}>{e.notes}</div> : null}
            </div>

            <button type="button" onClick={() => onDelete(e.id)} aria-label="Delete entry">
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
