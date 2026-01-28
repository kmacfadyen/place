import { useState } from "react";
import type { Dog } from "../lib/types";
import { createDogForUser, linkDogToUserByCode } from "../lib/dogs";

type Props = {
  userId: string;
  dogs: Dog[];
  onChanged: () => void; // refresh dogs from storage in parent
};

export default function DogManager({ userId, dogs, onChanged }: Props) {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [dogCode, setDogCode] = useState("");

  const [lastCreatedCode, setLastCreatedCode] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  return (
    <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Dogs</h2>

      {err ? <p style={{ color: "crimson" }}>{err}</p> : null}
      {msg ? <p style={{ color: "green" }}>{msg}</p> : null}

      {/* List dogs + invite codes */}
      {dogs.length > 0 ? (
        <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
          <strong>Your dogs</strong>

          {dogs.map((dog) => (
            <div
              key={dog.id}
              style={{
                border: "1px dashed #ddd",
                borderRadius: 10,
                padding: 12,
                display: "grid",
                gap: 6,
              }}
            >
              <div style={{ fontWeight: 700 }}>{dog.name}</div>

              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, opacity: 0.8 }}>
                  Invite code: <strong>{dog.shareCode}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(dog.shareCode)}
                  >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ opacity: 0.8, marginBottom: 16 }}>
          No dogs yet. Create one below, or link a shared dog with an invite code.
        </p>
      )}

      <div style={{ display: "grid", gap: 18 }}>
        {/* Create dog */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setErr(null);
            setMsg(null);

            if (!name.trim()) {
              setErr("Dog name is required.");
              return;
            }

            const dog = createDogForUser({ userId, name, breed });
            setLastCreatedCode(dog.shareCode);

            setName("");
            setBreed("");
            setMsg(`Dog created: ${dog.name}`);
            onChanged();
          }}
          style={{ display: "grid", gap: 10, maxWidth: 520 }}
        >
          <strong>Create a dog profile</strong>

          <input
            placeholder="Dog name (e.g., Hazel)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Breed (optional)"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
          />

          {/* Show invite code for the last created dog */}
          {lastCreatedCode ? (
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, opacity: 0.8 }}>
                Invite code: <strong>{lastCreatedCode}</strong>
              </span>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(lastCreatedCode)}
                >
                  Copy
              </button>
            </div>
          ) : null}

          <button type="submit">Create dog</button>
        </form>

        {/* Link dog */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setErr(null);
            setMsg(null);

            if (!dogCode.trim()) {
              setErr("Enter a dog invite code.");
              return;
            }

            const res = linkDogToUserByCode({ userId, dogCode });

            if (!res.ok) {
              setErr(res.reason);
              return;
            }

            setDogCode("");
            setLastCreatedCode(null);
            setMsg("Dog linked to your account.");
            onChanged();
          }}
          style={{ display: "grid", gap: 10, maxWidth: 520 }}
        >
          <strong>Link an existing dog (shared dog)</strong>

          <input
            placeholder="Invite code (e.g., HAZEL-7F2K)"
            value={dogCode}
            onChange={(e) => setDogCode(e.target.value)}
          />

          <button type="submit">Link dog</button>

          <small style={{ opacity: 0.8 }}>
            Ask the other owner for the dog’s invite code (example: HAZEL-7F2K).
          </small>
        </form>
      </div>
    </section>
  );
}
