// src/components/TagSelector.tsx
import { useEffect, useState } from "react";
import api from "../api/axios";

interface Tag { id: number; name: string }

interface Props {
  selected: number[];
  setSelected: (ids: number[]) => void;
  refreshTrigger?: number;
}

export default function TagSelector({ selected, setSelected, refreshTrigger }: Props) {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    api.get<Tag[]>("/tags").then(res => setTags(res.data)).catch(console.error);
  }, [refreshTrigger]);

  const toggle = (id: number) =>
    setSelected(selected.includes(id)
      ? selected.filter(x => x !== id)
      : [...selected, id]);

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {tags.map(tag => (
        <button
          key={tag.id}
          type="button"
          onClick={() => toggle(tag.id)}
          className={
            `px-3 py-1 border rounded font-serif ` +
            (selected.includes(tag.id)
              ? "bg-accent text-white"
              : "bg-white text-gray-800")
          }
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
}
