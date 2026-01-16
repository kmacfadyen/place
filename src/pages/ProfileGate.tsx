import { useEffect, useState } from "react";
import type { User } from "../lib/types";
import { loadState } from "../lib/storage";
import { createUser, setCurrentUser, verifyUserPassword, deleteUser } from "../lib/auth";

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

  {error ? <p style={{ color: "crimson" }}>{error}</p> : null}


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

  function handleDeleteUser(userId: string) {
  const state = loadState();
  const user = state.users.find((u) => u.id === userId);

  const label = user ? `${user.name} (${user.email})` : "this user";

  const ok = window.confirm(`Delete ${label}? This will also delete all their entries.`);
  if (!ok) return;

  // If they're trying to delete the currently selected user in the login prompt, close it
  if (selectedUserId === userId) {
    setSelectedUserId(null);
    setLoginPassword("");
  }

  deleteUser(userId);
  refreshUsers();

  // If you’re keeping any error message, clear it
  setError("");
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
          {selectedUserId && (
  <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
    <h2 style={{ marginTop: 0 }}>Enter password</h2>

    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");

        const ok = await verifyUserPassword(selectedUserId, loginPassword);
        if (!ok) {
          setError("Incorrect password.");
          return;
        }

        const state = loadState();
        const user = state.users.find((u) => u.id === selectedUserId);
        if (!user) {
          setError("User not found.");
          return;
        }

        setCurrentUser(user.id);
        onAuthed(user);
      }}
      style={{ display: "grid", gap: 12 }}
    >
      <label style={{ display: "grid", gap: 6 }}>
        Password
        <input
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />
      </label>

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit">Log in</button>
        <button type="button" onClick={() => setSelectedUserId(null)}>
          Cancel
        </button>
      </div>
    </form>
  </section>
)}

          <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
            {users.map((u) => (
              <li key={u.id} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{u.name}</div>
                  <div style={{ fontSize: 13, opacity: 0.8 }}>{u.email}</div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
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

  <button
    type="button"
    onClick={() => handleDeleteUser(u.id)}
    style={{ color: "crimson" }}
  >
    Delete
  </button>
</div>


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
          <label style={{ display: "grid", gap: 6 }}>
  Password
  <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
</label>

          <button type="submit">Create profile</button>
        </form>
      </section>
    </div>
  );
}
