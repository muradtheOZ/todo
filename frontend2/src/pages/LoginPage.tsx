import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import api from "../api/axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      await api.post("/auth/login", form);
      navigate("/todos", { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.msg) {
        setErr(error.response.data.msg);
      } else {
        setErr("Login failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-gray-300 rounded-lg shadow-md p-6 font-serif">
        <h1 className="text-2xl font-bold text-center mb-4">Welcome Back</h1>
        {err && <p className="text-red-700 text-sm mb-4">{err}</p>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-400 rounded focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          New here?{" "}
          <Link to="/register" className="text-gray-800 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
