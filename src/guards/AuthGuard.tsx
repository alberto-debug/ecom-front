import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getUserFromToken } from "../services/api";
import type { User } from "../types";
import type { ReactNode } from "react"; // ✅ safe import

interface AuthGuardProps {
  children: ReactNode;
  requiredRole: string;
}

function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    try {
      const user: User = getUserFromToken(token);
      const required = requiredRole.startsWith("ROLE_")
        ? requiredRole.toUpperCase()
        : `ROLE_${requiredRole.toUpperCase()}`;
      const hasRole = user.roles.some(
        (role) => role.toUpperCase() === required,
      );
      setIsAuthorized(hasRole);
    } catch {
      localStorage.removeItem("token");
      setIsAuthorized(false);
    }
  }, [requiredRole]);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/" replace />;
}

export default AuthGuard;
