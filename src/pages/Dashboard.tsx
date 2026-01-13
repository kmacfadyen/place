import { useEffect, useMemo, useState } from "react";
import EntryForm from "../components/EntryForm";
import EntryList from "../components/EntryList";
import FilterBar from "../components/FilterBar";
import { loadState, saveState } from "../lib/storage";
import { setCurrentUser } from "../lib/auth";
import type { Entry, EntryTypeId, User } from "../lib/types";

type FilterType = "all" | EntryTypeId;

type Props = {
  user: User;
  onLogout: () => void;
};

export default function Dashboard({ user, onLogout }: Props) {
  const [entries, setEntries] = useState<Entry[]>(() => loadState().entries);
  const [filterTypeId, setFilterTypeId] = useState<FilterType>("all");

  useEffect(() => {
    const state = loadState();
    saveState({ ...state, entries });
  }, [entries]);

  const myEntries = useMemo(
    () => entries.filter((e) => e.userId === user.id),
    [entries, user.id]
  );

  const filtered = useMemo(() => {
    const sorted = [...myEntries].sort(
      (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
    );
    if (filterTypeId === "all") return sorted;
    return sorted.filter((e) => e.typeId === filterTypeId);
  }, [myEntries, filterTypeId]);

  function handleAdd(entry: Entry) {
    setEntries((prev) => [entry, ...prev]);
  }

  function handleDelete(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function handleLogout() {
    setCurrentUser(null);
    onLogout();
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16, display: "grid", gap: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
        <div>
          <h1 style={{ marginBottom: 6 }}>Dog Tracker</h1>
          <p style={{ marginTop: 0, opacity: 0.8 }}>Signed in as {user.name}</p>
        </div>
        <button type="button" onClick={handleLogout}>Log out</button>
      </header>

      <EntryForm userId={user.id} onAdd={handleAdd} />

      <section>
        <FilterBar filterTypeId={filterTypeId} setFilterTypeId={setFilterTypeId} />
        <EntryList entries={filtered} onDelete={handleDelete} />
      </section>
    </div>
  );
}
