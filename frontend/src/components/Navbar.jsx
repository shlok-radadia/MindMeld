import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const location = useLocation();

  
  if (location.pathname === "/") return null;

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-card)]/90 backdrop-blur border-b border-gray-800">
      <nav className="mx-auto px-6 py-4 flex items-center justify-between">
    
    
        <Link to={user ? "/dashboard" : "/"} className="text-xl font-bold tracking-wide">
          <span className="text-blue-500">Mind</span>Meld
        </Link>


        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white">
                Login
              </Link>
              <Link to="/signup" className="btn-primary">
                Sign up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-white"
              >
                Dashboard
              </Link>

              <Link to="/leaderboard" className="text-gray-300 hover:text-white">
                Leaderboard
              </Link>


              <Link
                to="/profile"
                className="text-gray-300 hover:text-white"
              >
                Profile
              </Link>

              <button onClick={() => {logout(); navigate("/");}} className="btn-secondary">
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}