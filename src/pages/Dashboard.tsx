import { useEffect, useMemo, useState } from "react";
import EntryForm from "../components/EntryForm";
import EntryList from "../components/EntryList";
import FilterBar from "../components/FilterBar";
import { loadState, saveState } from "../lib/storage";
import { setCurrentUser } from "../lib/auth";
import type { Entry, EntryTypeId, User } from "../lib/types";
import { changePassword } from "../lib/auth";
import type { Dog } from "../lib/types";
import DogSwitcher from "../components/DogSwitcher";
import DogManager from "../components/DogManager";
import { listDogsForUser, getActiveDogId, setActiveDogId } from "../lib/dogs";


type FilterType = "all" | EntryTypeId;

type Props = {
  user: User;
  onLogout: () => void;
};

export default function Dashboard({ user, onLogout }: Props) {
  const [entries, setEntries] = useState<Entry[]>(() => loadState().entries);
  const [filterTypeId, setFilterTypeId] = useState<FilterType>("all");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<string | null>(null);
  const [dogs, setDogs] = useState<Dog[]>(() => listDogsForUser(user.id));
  const [activeDogId, setActiveDog] = useState<string | null>(() => getActiveDogId(user.id));


  useEffect(() => {
    const state = loadState();
    saveState({ ...state, entries });
  }, [entries]);

  const myEntries = useMemo(
  () => entries.filter((e) => e.userId === user.id && (!activeDogId || e.dogId === activeDogId)),
  [entries, user.id, activeDogId]
);


  function refreshDogs() {
  const nextDogs = listDogsForUser(user.id);
  setDogs(nextDogs);

  const current = getActiveDogId(user.id);
  // If active dog got deleted/unlinked later, reset
  const stillExists = current && nextDogs.some(d => d.id === current);
  const nextActive = stillExists ? current : (nextDogs[0]?.id ?? null);

  setActiveDog(nextActive);
  setActiveDogId(user.id, nextActive);
}

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
      <DogSwitcher
          dogs={dogs}
          activeDogId={activeDogId}
          onChange={(dogId) => {
          setActiveDog(dogId);
          setActiveDogId(user.id, dogId);
        }}
      />
      <DogManager userId={user.id} onChanged={refreshDogs} />

      {activeDogId ? (
    <EntryForm userId={user.id} dogId={activeDogId} onAdd={handleAdd} />
      ) : (
        <p style={{ opacity: 0.8 }}>
          Create or link a dog to start logging entries.
        </p>
      )}


      <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
  <h2 style={{ marginTop: 0 }}>Change password</h2>

  {pwErr ? <p style={{ color: "crimson", marginTop: 0 }}>{pwErr}</p> : null}
  {pwMsg ? <p style={{ color: "green", marginTop: 0 }}>{pwMsg}</p> : null}

  <form
    onSubmit={async (e) => {
      e.preventDefault();
      setPwErr(null);
      setPwMsg(null);

      const result = await changePassword(user.id, currentPw, newPw);

      if (!result.ok) {
        setPwErr(result.reason);
        return;
      }

      setPwMsg("Password updated.");
      setCurrentPw("");
      setNewPw("");
    }}
    style={{ display: "grid", gap: 12, maxWidth: 420 }}
  >
    <label style={{ display: "grid", gap: 6 }}>
      Current password
      <input
        type="password"
        value={currentPw}
        onChange={(e) => setCurrentPw(e.target.value)}
        autoComplete="current-password"
        required
      />
    </label>

    <label style={{ display: "grid", gap: 6 }}>
      New password
      <input
        type="password"
        value={newPw}
        onChange={(e) => setNewPw(e.target.value)}
        autoComplete="new-password"
        minLength={6}
        required
      />
    </label>

    <button type="submit">Update password</button>
  </form>
</section>


      <section>
        <FilterBar filterTypeId={filterTypeId} setFilterTypeId={setFilterTypeId} />
        <EntryList entries={filtered} onDelete={handleDelete} />
      </section>
    </div>
  );
}
