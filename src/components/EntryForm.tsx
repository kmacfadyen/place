import { useMemo, useState } from "react";
import type { Entry } from "../lib/types";
import { ENTRY_TYPES, makeEntry } from "../lib/types";

type EntryFormProps = {
  onAdd: (entry: Entry) => void;
};

export default function EntryForm({ onAdd }: EntryFormProps) {
  ...
}
