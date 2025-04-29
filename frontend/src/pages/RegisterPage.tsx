import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import axios from "axios";

export default function RegisterPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      nav("/todos");
    } catch (error) {
      // narrow to AxiosError if possible
      if (axios.isAxiosError(error) && error.response?.data?.msg) {
        setErr(error.response.data.msg);
      } else {
        setErr("Registration failed");
      }
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Register</h2>
      {err && <p style={{ color: "red" }}>{err}</p>}
      <input
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}
