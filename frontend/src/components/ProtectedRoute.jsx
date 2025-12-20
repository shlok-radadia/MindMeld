import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function ProtectedRoute() {
  const { loading } = useAuth();
  const token = localStorage.getItem("token");

  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading...
      </div>
    );
  }

  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  
  return <Outlet />;
}