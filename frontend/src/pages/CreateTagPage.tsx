import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CreateTagPage() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/tags", { name });
    navigate("/tags");
  };

  return (
    <div className="p-6 max-w-md mx-auto font-serif">
      <h1 className="text-2xl font-bold mb-4">Create Tag</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full"
          placeholder="Tag name"
          required
        />
        <button className="btn btn-primary w-full">Create</button>
      </form>
    </div>
  );
}
