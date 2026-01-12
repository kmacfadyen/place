import { ENTRY_TYPES } from "../lib/types";
import type { EntryTypeId } from "../lib/types";

type FilterType = EntryTypeId | "all";

type FilterBarProps = {
  filterTypeId: FilterType;
  setFilterTypeId: (value: FilterType) => void;
};

export default function FilterBar({
  filterTypeId,
  setFilterTypeId,
}: FilterBarProps) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "12px 0" }}>
      <strong>Filter:</strong>

      <button
        type="button"
        onClick={() => setFilterTypeId("all")}
        style={{ fontWeight: filterTypeId === "all" ? 700 : 400 }}
      >
        All
      </button>

      {ENTRY_TYPES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => setFilterTypeId(t.id)}
          style={{ fontWeight: filterTypeId === t.id ? 700 : 400 }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
