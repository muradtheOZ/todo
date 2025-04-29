import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axios";

type Props = { children: ReactNode };

export default function PrivateRoute({ children }: Props) {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    api.get("/auth/verify")   // you can add a /verify endpoint or reuse GET /todos with 401 check
      .then(() => setOk(true))
      .catch(() => setOk(false));
  }, []);

  if (ok === null) return <div>Loading...</div>;
  if (!ok) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
