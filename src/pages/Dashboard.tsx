import { useEffect, useMemo, useState } from "react";
import EntryForm from "../components/EntryForm";
import EntryList from "../components/EntryList";
import FilterBar from "../components/FilterBar";
import { loadState, saveState } from "../lib/storage";

export default function Dashboard() {
  const [entries, setEntries] = useState(() => loadState().entries);
  const [filterTypeId, setFilterTypeId] = useState("all");

  useEffect(() => {
    saveState({ entries });
  }, [entries]);

  const filtered = useMemo(() => {
    const sorted = [...entries].sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO));
    if (filterTypeId === "all") return sorted;
    return sorted.filter((e) => e.typeId === filterTypeId);
  }, [entries, filterTypeId]);

  function handleAdd(entry) {
    setEntries((prev) => [entry, ...prev]);
  }

  function handleDelete(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16, display: "grid", gap: 16 }}>
      <header>
        <h1 style={{ marginBottom: 6 }}>Dog Tracker</h1>
        <p style={{ marginTop: 0, opacity: 0.8 }}>
          Track walks, vet visits, treats, meds, grooming — whatever you need.
        </p>
      </header>

      <EntryForm onAdd={handleAdd} />

      <section>
        <FilterBar filterTypeId={filterTypeId} setFilterTypeId={setFilterTypeId} />
        <EntryList entries={filtered} onDelete={handleDelete} />
      </section>
    </div>
  );
}
