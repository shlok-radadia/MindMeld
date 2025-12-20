import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
    occupation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
          document.body.style.overflow = "auto";
      };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { username, email, password, age, occupation } = form;

    if (!username || !email || !password || !age || !occupation) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      
      await api.post("/api/users/register", {
        username,
        email,
        password,
        age: Number(age),
        occupation,
      });

      
      const res = await api.post("/api/users/login", {
        email,
        password,
      });

      login(res.data.token);
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 overflow-hidden">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create your account
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Username
            </label>
            <input
              name="username"
              className="input"
              placeholder="yourname"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="input"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Age
              </label>
              <input
                type="number"
                name="age"
                className="input"
                placeholder="18"
                value={form.age}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Occupation
              </label>
              <input
                name="occupation"
                className="input"
                placeholder="Student"
                value={form.occupation}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}