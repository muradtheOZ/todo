import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

export default function EditTagPage() {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/tags/${id}`).then(res => setName(res.data.name));
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.put(`/tags/${id}`, { name });
    navigate("/tags");
  };

  return (
    <div className="p-6 max-w-md mx-auto font-serif">
      <h1 className="text-2xl font-bold mb-4">Edit Tag</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="input input-bordered w-full"
          required
        />
        <button className="btn btn-primary w-full">Update</button>
      </form>
    </div>
  );
}
