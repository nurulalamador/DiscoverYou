import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8000/auth", {
          credentials: "include", // important if using cookies
        });
        const data = await res.json();
        setIsAuthenticated(data.isAuthenticate);
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  if (!authChecked) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60">
      <div role="status" className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-t-orange-500 border-gray-200" />
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
