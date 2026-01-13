import { useState } from "react";
import type { User } from "./lib/types";
import ProfileGate from "./pages/ProfileGate";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  if (!user) return <ProfileGate onAuthed={setUser} />;

  return <Dashboard user={user} onLogout={() => setUser(null)} />;
}
