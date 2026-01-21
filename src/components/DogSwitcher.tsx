import { useMemo } from "react";
import type { Dog } from "../lib/types";

type Props = {
  dogs: Dog[];
  activeDogId: string | null;
  onChange: (dogId: string) => void;
};

export default function DogSwitcher({ dogs, activeDogId, onChange }: Props) {
  const hasDogs = dogs.length > 0;

  const activeLabel = useMemo(() => {
    const d = dogs.find(x => x.id === activeDogId);
    return d ? d.name : "Select a dog";
  }, [dogs, activeDogId]);

  if (!hasDogs) return null;

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <strong>Dog:</strong>
      <select
        value={activeDogId ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          {activeLabel}
        </option>
        {dogs.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>
    </div>
  );
}
