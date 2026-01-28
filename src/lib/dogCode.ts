function randomChunk(length: number): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // avoids O/0, I/1 confusion
  return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export function generateDogCode(dogName: string): string {
  const prefix = dogName
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 5)
    .toUpperCase();

  return `${prefix}-${randomChunk(4)}`;
}
