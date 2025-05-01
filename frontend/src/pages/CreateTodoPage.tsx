// src/pages/CreateTodoPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { isAxiosError } from "axios";
import api from "../api/axios";
import TagSelector from "../components/TagSelector";

export default function CreateTodoPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [err, setErr] = useState("");

  // For refreshing TagSelector after new tag
  const [tagRefresh, setTagRefresh] = useState(0);

  // Modal state & new tag name
  const [showTagModal, setShowTagModal] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  // Create the todo
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      await api.post("/todos", { title, content, dueDate, tagIds });
      navigate("/todos", { replace: true });
    } catch (error: unknown) {
      if (
        isAxiosError(error) &&
        error.response &&
        typeof error.response.data === "object" &&
        "msg" in error.response.data
      ) {
        setErr((error.response.data as { msg: string }).msg);
      } else {
        setErr("Failed to create todo");
      }
    }
  };

  // Create a new tag via modal
  const createTag = async () => {
    if (!newTagName.trim()) return;
    try {
      await api.post("/tags", { name: newTagName.trim() });
      setShowTagModal(false);
      setNewTagName("");
      // trigger TagSelector refresh
      setTagRefresh((x) => x + 1);
    } catch (error: unknown) {
      if (
        isAxiosError(error) &&
        error.response &&
        typeof error.response.data === "object" &&
        "msg" in error.response.data
      ) {
        alert((error.response.data as { msg: string }).msg);
      } else {
        alert("Failed to create tag");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 font-serif">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">New Todo</h1>
        {err && <p className="text-red-700 mb-4">{err}</p>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            />
          </div>
          <div>
            <label className="block mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            />
          </div>
          <div>
            <label className="block mb-1">Tags</label>
            <div className="flex items-center gap-2">
              <TagSelector
                selected={tagIds}
                setSelected={setTagIds}
                refreshTrigger={tagRefresh}
              />
              <button
                type="button"
                onClick={() => setShowTagModal(true)}
                className="px-3 py-1 bg-secondary text-white rounded hover:bg-bg-accent transition"
              >
                + Tag
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-primary py-2  text-white rounded hover:bg-gray-900 transition"
          >
            Create
          </button>
        </form>
      </div>

      {/* Tag Creation Modal */}
      {/* Tag Creation Modal */}
      {showTagModal && (
        <div
          className="
      fixed inset-0
      bg-white bg-opacity-30
      backdrop-blur-md
      flex items-center justify-center
      z-50
    "
        >
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Create New Tag</h2>
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Tag name"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowTagModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={createTag}
                className="px-4 py-2 bg-primary text-red rounded hover:bg-gray-900 bg-blue-600 "
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
