import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

interface Tag {
  id: number;
  name: string;
}

export default function TagListPage() {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    api.get<Tag[]>("/tags").then((res) => setTags(res.data));
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto font-serif">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tags</h1>
        <div className="flex gap-4">
        <Link to="/todos" className="btn btn-secondary btn-sm">
          back to todos
        </Link>
        <Link to="/tags/new" className="btn btn-primary btn-sm">
          + New Tag
        </Link>
        </div>
      </div>
      <ul className="space-y-2">
        {tags.map((tag) => (
          <li
            key={tag.id}
            className="flex justify-between items-center p-3 border rounded bg-base-100"
          >
            <span>{tag.name}</span>
            <Link
              to={`/tags/${tag.id}/edit`}
              className="btn btn-sm  btn-outline"
            >
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
