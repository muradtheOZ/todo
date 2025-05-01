// src/pages/TodoListPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAxiosError } from "axios";
import api from "../api/axios";
import TagSelector from "../components/TagSelector";

interface TagRelation {
  tag: { id: number; name: string };
}

interface TodoWithTags {
  id: number;
  title: string;
  content: string;
  status: "incomplete" | "complete";
  dueDate: string | null;
  updatedAt: string;
  completedAt: string | null;
  tags: TagRelation[];
}

export default function TodoListPage() {
  const [todos, setTodos] = useState<TodoWithTags[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "incomplete" | "complete"
  >("all");
  const [tagFilter, setTagFilter] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const fetchTodos = () => {
    setLoading(true);
    setErr("");
    api
      .get<{ todos: TodoWithTags[]; totalPages: number }>("/todos", {
        params: {
          page,
          limit: 10,
          ...(statusFilter !== "all" && { status: statusFilter }),
          ...(tagFilter.length > 0 && { tagIds: tagFilter.join(",") }),
        },
      })
      .then((res) => {
        setTodos(res.data.todos);
        setTotalPages(res.data.totalPages);
      })
      .catch((error: unknown) => {
        if (
          isAxiosError(error) &&
          error.response &&
          typeof error.response.data === "object" &&
          "msg" in error.response.data
        ) {
          setErr((error.response.data as { msg: string }).msg);
        } else {
          setErr("Failed to load todos");
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchTodos, [page, statusFilter, tagFilter]);

  const toggleStatus = (todo: TodoWithTags) => {
    api
      .put<TodoWithTags>(`/todos/${todo.id}`, {
        title: todo.title,
        content: todo.content,
        dueDate: todo.dueDate,
        status: todo.status === "complete" ? "incomplete" : "complete",
        tagIds: todo.tags.map((r) => r.tag.id),
      })
      .then(fetchTodos)
      .catch(console.error);
  };

  const today = new Date();

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-serif">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">My Todo List</h1>
          <Link
            to="/todos/new"
            className="px-4 py-2 bg-primary bg-gray-800 text-white rounded hover:bg-gray-900 transition"
          >
            + New Todo
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-gray-700 mb-1">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as "all" | "incomplete" | "complete"
                )
              }
              className="px-3 py-1 border rounded focus:outline-none focus:ring"
            >
              <option value="all">All</option>
              <option value="incomplete">Incomplete</option>
              <option value="complete">Complete</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 mb-1">Tags:</label>
            <TagSelector
              selected={tagFilter}
              setSelected={(ids) => {
                setPage(1);
                setTagFilter(ids);
              }}
            />
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : err ? (
          <p className="text-red-700">{err}</p>
        ) : (
          <table className="w-full bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Content</th>
                <th className="px-4 py-2 text-left">Tags</th>
                <th className="px-4 py-2 text-center">Status</th>
                <th className="px-4 py-2 text-left">Updated</th>
                <th className="px-4 py-2 text-left">Due</th>
                <th className="px-4 py-2 text-left">Completed</th>
                <th className="px-4 py-2 text-left">Actions</th> {/* new */}
              </tr>
            </thead>
            <tbody>
              {todos.map((t, idx) => {
                const due = t.dueDate ? new Date(t.dueDate) : null;
                const isOverdue =
                  due !== null && due < today && t.status === "incomplete";
                return (
                  <tr
                    key={t.id}
                    className={`${idx % 2 === 1 ? "bg-gray-100" : ""} ${
                      isOverdue ? "bg-red-100" : ""
                    }`}
                  >
                    <td className="px-4 py-2 border-t border-gray-200">
                      {t.title}
                    </td>
                    <td className="px-4 py-2 border-t border-gray-200 truncate max-w-xs">
                      {t.content}
                    </td>
                    <td className="px-4 py-2 border-t border-gray-200">
                      {t.tags.map((r) => r.tag.name).join(", ")}
                    </td>
                    <td className="px-4 py-2 border-t border-gray-200 text-center">
                      <input
                        type="checkbox"
                        checked={t.status === "complete"}
                        onChange={() => toggleStatus(t)}
                      />
                    </td>
                    <td className="px-4 py-2 border-t border-gray-200">
                      {new Date(t.updatedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border-t border-gray-200">
                      {due ? due.toLocaleDateString() : "-"}
                    </td>
                    <td className="px-4 py-2 border-t border-gray-200">
                      {t.completedAt
                        ? new Date(t.completedAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="px-4  py-2 border-t border-gray-200">
                      <button className="btn-secondary px-2 py-1 rounded">
                        <Link
                          to={`/todos/${t.id}/edit`}
                          className="text-indigo-600  hover:underline"
                        >
                          Edit
                        </Link>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-3 items-center mt-6">
          <button
            className="px-4 py-2 bg-secondary text-white rounded disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>
          <span className="text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-secondary text-white rounded disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
