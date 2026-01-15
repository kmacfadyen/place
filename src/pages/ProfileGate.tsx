import { useEffect, useState } from "react";
import type { User } from "../lib/types";
import { loadState } from "../lib/storage";
import { createUser, setCurrentUser } from "../lib/auth";

type Props = {
  onAuthed: (user: User) => void;
};

export default function ProfileGate({ onAuthed }: Props) {
  const [password, setPassword] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  

  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const state = loadState();
    setUsers(state.users);

    const current = state.users.find((u) => u.id === state.currentUserId);
    if (current) onAuthed(current);
  }, [onAuthed]);

  function refreshUsers() {
    setUsers(loadState().users);
  }

  async function handleCreate(e: React.FormEvent) {
  e.preventDefault();
  setError("");

  if (!name.trim() || !email.trim() || password.length < 6) {
    setError("Please enter name, email, and a password (6+ characters).");
    return;
  }

  const user = await createUser(name, email, password);
  refreshUsers();
  onAuthed(user);

  setName("");
  setEmail("");
  setPassword("");
}


  function handleSelect(user: User) {
    setCurrentUser(user.id);
    onAuthed(user);
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 16, display: "grid", gap: 16 }}>
      <header>
        <h1 style={{ marginBottom: 6 }}>Dog Tracker</h1>
        <p style={{ marginTop: 0, opacity: 0.8 }}>Choose a profile or create a new one.</p>
      </header>

      {users.length > 0 && (
        <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>Existing profiles</h2>
          <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
            {users.map((u) => (
              <li key={u.id} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{u.name}</div>
                  <div style={{ fontSize: 13, opacity: 0.8 }}>{u.email}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setSelectedUserId(u.id);
                    setLoginPassword("");
                  }}
                >
                  Use profile
                </button>

              </li>
            ))}
          </ul>
        </section>
      )}

      <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Create a profile</h2>
        <form onSubmit={handleCreate} style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <button type="submit">Create profile</button>
        </form>
      </section>
    </div>
  );
}
