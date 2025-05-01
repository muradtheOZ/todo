// src/pages/EditTodoPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import api from "../api/axios";
import TagSelector from "../components/TagSelector";

interface TagRelation {
  tag: {
    id: number;
    name: string;
  };
}

interface TodoWithTags {
  id: number;
  title: string;
  content: string | null;
  dueDate: string | null;
  status: "incomplete" | "complete";
  tags: TagRelation[];
}

export default function EditTodoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<"incomplete" | "complete">("incomplete");
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!id) {
      navigate("/todos");
      return;
    }

    api
      .get<TodoWithTags>(`/todos/${id}`)
      .then(res => {
        const t = res.data;
        setTitle(t.title);
        setContent(t.content ?? "");
        setDueDate(t.dueDate ? t.dueDate.split("T")[0] : "");
        setStatus(t.status);
        setTagIds(t.tags.map(rel => rel.tag.id));
      })
      .catch((error: AxiosError) => {
        // if not found or unauthorized, go back
        if(error)
        navigate("/todos", { replace: true });
      });
  }, [id, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    if (!id) {
      setErr("Invalid todo ID");
      return;
    }

    try {
      await api.put<TodoWithTags>(`/todos/${id}`, {
        title,
        content,
        dueDate,
        status,
        tagIds,
      });
      navigate("/todos", { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.msg) {
        setErr(error.response.data.msg as string);
      } else {
        setErr("Failed to update todo");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 font-serif">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Edit Todo</h1>
        {err && <p className="text-red-700 mb-4">{err}</p>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block mb-1">Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Content</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            />
          </div>
          <div>
            <label className="block mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            />
          </div>
          <div>
            <label className="block mb-1">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as "incomplete" | "complete")}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            >
              <option value="incomplete">Incomplete</option>
              <option value="complete">Complete</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Tags</label>
            <TagSelector selected={tagIds} setSelected={setTagIds} />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}
