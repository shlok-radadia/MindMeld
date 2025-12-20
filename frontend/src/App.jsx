import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import Navbar from "./components/Navbar";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

import MemoryTest from "./pages/tests/MemoryTest";
import AttentionTest from "./pages/tests/AttentionTest";
import ReactionTest from "./pages/tests/ReactionTest";
import ProblemTest from "./pages/tests/ProblemTest";
import PublicProfile from "./pages/PublicProfile";
import Leaderboard from "./pages/Leaderboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/u/:id" element={<PublicProfile />} />
              <Route path="/leaderboard" element={<Leaderboard />} />

              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />

                <Route path="/tests/memory" element={<MemoryTest />} />
                <Route path="/tests/attention" element={<AttentionTest />} />
                <Route path="/tests/reaction" element={<ReactionTest />} />
                <Route path="/tests/problem" element={<ProblemTest />} />
              </Route>
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}