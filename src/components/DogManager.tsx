import { useState } from "react";
import { createDogForUser, linkDogToUserByCode } from "../lib/dogs";

type Props = {
  userId: string;
  onChanged: () => void; // call to refresh dogs from storage
};

export default function DogManager({ userId, onChanged }: Props) {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [dogCode, setDogCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  return (
    <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Dogs</h2>

      {err ? <p style={{ color: "crimson" }}>{err}</p> : null}
      {msg ? <p style={{ color: "green" }}>{msg}</p> : null}

      <div style={{ display: "grid", gap: 18 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setErr(null);
            setMsg(null);
            if (!name.trim()) return setErr("Dog name is required.");

            createDogForUser({ userId, name, breed });
            setName("");
            setBreed("");
            setMsg("Dog created.");
            onChanged();
          }}
          style={{ display: "grid", gap: 10, maxWidth: 420 }}
        >
          <strong>Create a dog profile</strong>
          <input placeholder="Dog name (e.g., Hazel)" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Breed (optional)" value={breed} onChange={(e) => setBreed(e.target.value)} />
          <button type="submit">Create dog</button>
        </form>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setErr(null);
            setMsg(null);
            if (!dogCode.trim()) return setErr("Enter a dog code.");

            const res = linkDogToUserByCode({ userId, dogCode });
            if (!res.ok) return setErr(res.reason);

            setDogCode("");
            setMsg("Dog linked to your account.");
            onChanged();
          }}
          style={{ display: "grid", gap: 10, maxWidth: 420 }}
        >
          <strong>Link an existing dog (shared dog)</strong>
          <input placeholder="Dog code (from the other parent)" value={dogCode} onChange={(e) => setDogCode(e.target.value)} />
          <button type="submit">Link dog</button>
          <small style={{ opacity: 0.8 }}>
            For now, the “dog code” is the dog’s ID. Next we can make this a nicer short invite code.
          </small>
        </form>
      </div>
    </section>
  );
}
