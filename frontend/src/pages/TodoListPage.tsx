import { useEffect, useState } from "react";
import api from "../api/axios";

type Todo = { id: number; title: string; status: string; dueDate?: string };

export default function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get("/todos", { params: { page, limit: 20 } })
      .then(res => setTodos(res.data.todos))
      .catch(console.error);
  }, [page]);

  return (
    <div>
      <h2>Your Todos (Page {page})</h2>
      <ul>
        {todos.map(t => (
          <li key={t.id}>
            {t.title} – {t.status}
          </li>
        ))}
      </ul>
      <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
        Prev
      </button>
      <button onClick={() => setPage(p => p + 1)}>Next</button>
    </div>
  );
}
