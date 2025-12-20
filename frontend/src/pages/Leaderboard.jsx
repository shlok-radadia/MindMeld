import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/leaderboard")
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-gray-400">Loading leaderboard...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-5">
      <h1 className="text-3xl font-bold">🏆 Leaderboard</h1>

      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead className="border-b border-gray-800">
            <tr className="text-gray-400 text-sm">
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">MindScore</th>
              <th className="py-3 px-4">Streak</th>
            </tr>
          </thead>

          <tbody>
            {data.map((u, i) => (
              <tr
                key={u._id}
                className="border-b border-gray-800 hover:bg-gray-800/40 transition"
              >
                <td className="py-3 px-4 font-semibold">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                </td>

                <td className="py-3 px-4">
                  <Link
                    to={`/u/${u._id}`}
                    className="text-blue-400 hover:underline"
                  >
                    {u.username}
                  </Link>
                </td>

                <td className="py-3 px-4 font-bold text-blue-400">
                  {u.mindScore}
                </td>

                <td className="py-3 px-4 text-orange-400">
                  🔥 {u.streak}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}