import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import api from "../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Accordion from "../components/Accordion";
import Heatmap from "../components/Heatmap";
import { calculateMindScore, getMindScoreMeta } from "../utils/mindScore";
import { useAuth } from "../context/AuthContext";

/* Reusable graph */
function StatGraph({ data, label }) {
  const chartData = [...data].reverse().map((v, i) => ({
    index: `#${i + 1}`,
    value: v.value, // ✅ FIX
    timestamp: new Date(v.createdAt).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="index" />
          <YAxis />
          <Tooltip
            contentStyle={{
                backgroundColor: "#0f172a", // dark slate
                border: "1px solid #1e293b",
                borderRadius: "8px",
                color: "#e5e7eb",
                boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            }}
            labelStyle={{
                color: "#93c5fd", // blue label
                fontWeight: "600",
            }}
            itemStyle={{
                color: "#e5e7eb",
            }}
            labelFormatter={(label, payload) =>
              payload?.[0]?.payload?.timestamp
            }
            formatter={(value) => [`${value}`, label]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function PublicProfile() {
  const { id } = useParams();
  const { user: authUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    api
      .get(`/api/u/${id}`)
      .then((res) => setData(res.data))
      .catch(() => setError("Profile not found"))
      .finally(() => setLoading(false));
  }, [id]);

//   console.log(id)

  if (authUser && authUser._id === id) {
    return <Navigate to="/profile" replace />;
  }

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-400">
        Loading profile...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center mt-20 text-red-400">
        {error || "Profile unavailable"}
      </div>
    );
  }

  const { user, attention, memory, reaction, problem, totals } = data;

  const mindScore = calculateMindScore({
    memoryAvg: memory.avg,
    attentionAvg: attention.avg,
    reactionAvg: reaction.avg,
    problemAvg: problem.avg,
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-7 space-y-8">
      {/* HEADER */}
      <div className="card flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{user.username}</h1>
          <p className="text-gray-400">
            {user.age} yrs · {user.occupation}
          </p>
          <p className="text-sm text-green-400">
            🔥 {user.streak}-day streak · Longest {user.longestStreak}
          </p>
        </div>

        <div className="text-right">
          <p className="text-5xl font-bold text-blue-400">
            {mindScore}
          </p>
          <p className={`text-sm ${getMindScoreMeta(mindScore).color}`}>
            {getMindScoreMeta(mindScore).label}
          </p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-bold">📊 Total Tests</h3>
        <p className="text-3xl">{totals.allTests}</p>
      </div>


      {/* HEATMAP */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">
          📅 Activity (Last 90 Days)
        </h3>
        <div className="overflow-x-auto">
            <div className="w-fit">
                <Heatmap data={data.heatmap || {}} />
            </div>
        </div>
        {/* <Heatmap data={data.heatmap || {}} /> */}
      </div>

      {/* ANALYTICS */}
      <Accordion title="🎯 Attention">
        <p className="text-gray-400">
          Tests Taken: <span className="text-white">{totals.attention}</span>
        </p>
        <p>Best: {attention.best} ms</p>
        <p>Average: {attention.avg?.toFixed(2)} ms</p>
        <StatGraph data={attention.last10} />
      </Accordion>

      <Accordion title="🧠 Memory">
        <p className="text-gray-400">
          Tests Taken: <span className="text-white">{totals.memory}</span>
        </p>
        <p>Best: {memory.best}%</p>
        <p>Average: {memory.avg?.toFixed(2)}%</p>
        <StatGraph data={memory.last10} />
      </Accordion>

      <Accordion title="⚡ Reaction">
        <p className="text-gray-400">
          Tests Taken: <span className="text-white">{totals.reaction}</span>
        </p>
        <p>Best: {reaction.best} ms</p>
        <p>Average: {reaction.avg?.toFixed(2)} ms</p>
        <StatGraph data={reaction.last10} />
      </Accordion>

      <Accordion title="➗ Problem Solving">
        <p className="text-gray-400">
          Tests Taken: <span className="text-white">{totals.problem}</span>
        </p>
        <p>Best: {problem.best}</p>
        <p>Average: {problem.avg?.toFixed(2)}</p>
        <StatGraph data={problem.last10} />
      </Accordion>
    </div>
  );
}