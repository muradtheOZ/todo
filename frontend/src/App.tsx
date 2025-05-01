import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TodoListPage from "./pages/TodoListPage";
import CreateTodoPage from "./pages/CreateTodoPage";
import EditTodoPage from "./pages/EditTodoPage";
import PrivateRoute from "./components/PrivateRoute";
import CreateTagPage from "./pages/CreateTagPage";
import EditTagPage from "./pages/EditTagPage";
import TagListPage from "./pages/TagListPage"; // Import the correct component

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/todos"
          element={
            <PrivateRoute>
              <TodoListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/todos/new"
          element={
            <PrivateRoute>
              <CreateTodoPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/todos/:id/edit"
          element={
            <PrivateRoute>
              <EditTodoPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/tags"
          element={
            <PrivateRoute>
              <TagListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/tags/new"
          element={
            <PrivateRoute>
              <CreateTagPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/tags/:id/edit"
          element={
            <PrivateRoute>
              <EditTagPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/todos" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
