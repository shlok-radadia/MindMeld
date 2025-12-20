import { useEffect, useState } from "react";
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
import { useAuth } from "../context/AuthContext";
import TestHistory from "../components/TestHistory";
import Accordion from "../components/Accordion";
import { getProgress } from "../utils/progress";
import ProgressBadge from "../components/ProgressBadge";
import { calculateMindScore, getMindScoreLabel, getMindScoreMeta } from "../utils/mindScore";
import Heatmap from "../components/Heatmap";



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
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                color: "#e5e7eb",
                boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            }}
            labelStyle={{
                color: "#93c5fd",
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


export default function Profile() {
  const { logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [memoryHistory, setMemoryHistory] = useState([]);
  const [attentionHistory, setAttentionHistory] = useState([]);
  const [reactionHistory, setReactionHistory] = useState([]);
  const [problemHistory, setProblemHistory] = useState([]);
  const [heatmap, setHeatmap] = useState({});
  const [section, setSection] = useState("overview");
  const [aiInsight, setAiInsight] = useState("");
  const [aiLoading, setAiLoading] = useState(false);



  useEffect(() => {
    api
      .get("/api/profiles")
      .then((res) => {
        setData(res.data);
        setAge(res.data.user.age);
        setOccupation(res.data.user.occupation);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    api.get("/api/memorytests/history").then((res) => {
      setMemoryHistory(
        res.data.map((t) => ({
          value: t.accuracy,
          createdAt: t.createdAt,
        }))
      );
    });

    api.get("/api/attentiontests/history").then((res) => {
      setAttentionHistory(
        res.data.map((t) => ({
          value: t.reactionTime,
          createdAt: t.createdAt,
        }))
      );
    });

    api.get("/api/reactiontests/history").then((res) => {
      setReactionHistory(
        res.data.map((t) => ({
          value: t.reactionTime,
          createdAt: t.createdAt,
        }))
      );
    });

    api.get("/api/problemtests/history").then((res) => {
      setProblemHistory(
        res.data.map((t) => ({
          value: t.problemsSolved,
          createdAt: t.createdAt,
        }))
      );
    });

    api.get("/api/profiles/heatmap").then((res) => {
      setHeatmap(res.data);
    });

    document.body.style.overflow = "hidden";
    return () => {
        document.body.style.overflow = "auto";
    };
  }, []);


    useEffect(() => {
    if (!data) return;

    setAiLoading(true);

    api.post("/api/ai/insight", {
        memoryAvg: memory.avg,
        attentionAvg: attention.avg,
        reactionAvg: reaction.avg,
        problemAvg: problem.avg,
        streak: user.streak,
        trend: "improving"
    })
    .then(res => setAiInsight(res.data.insight))
    .catch(() => setAiInsight(""))
    .finally(() => setAiLoading(false));
    }, [data]);

    // console.log(aiInsight)


  const saveProfile = async () => {
    try {
      setSaving(true);
      const res = await api.put("/api/profiles", {
        age: Number(age),
        occupation,
      });

      setData((prev) => ({
        ...prev,
        user: res.data.user,
      }));

      setEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    try {
      setPasswordLoading(true);
      setPasswordMsg("");

      await api.put("/api/users/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      // FORCE LOGOUT
      logout();

      setPasswordMsg("Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Optional: logout user
      // logout();

    } catch (err) {
      setPasswordMsg(
        err.response?.data?.message || "Failed to change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-400">
        Loading profile...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center mt-20 text-red-400">
        Failed to load profile
      </div>
    );
  }


  const {
    user,
    totals,
    attention,
    memory,
    reaction,
    problem,
  } = data;

  const mindScore = calculateMindScore({
    memoryAvg: memory.avg,
    attentionAvg: attention.avg,
    reactionAvg: reaction.avg,
    problemAvg: problem.avg,
  });

  const memoryProgress = getProgress(
    memory.last10,
    true
  );
  
  const reactionProgress = getProgress(
    reaction.last10,
    false
  );

  const attentionProgress = getProgress(
    attention.last10,
    false
  );

  const problemProgress = getProgress(
    problem.last10,
    true
  );


  return (
    <div className="bg-[var(--bg)]">
        {/* SIDEBAR */}
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-[var(--bg-card)] border-r border-gray-800 flex flex-col z-20">
        

        {/* NAV */}
        <nav className="flex-1 px-4 pt-8 space-y-2">
            {[
            ["overview", "Overview"],
            ["analytics", "Analytics"],
            ["history", "History"],
            ["settings", "Settings"],
            ].map(([key, label]) => (
            <button
                key={key}
                onClick={() => setSection(key)}
                className={`w-full text-left px-4 py-2 rounded-lg transition font-medium cursor-pointer
                ${
                    section === key
                    ? "bg-blue-500 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
            >
                {label}
            </button>
            ))}
        </nav>

        {/* LOGOUT */}
        <div className="px-4 py-4 border-t border-gray-800">
            <button
            onClick={logout}
            className="w-full text-left px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition cursor-pointer"
            >
            Logout
            </button>
        </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="ml-64 h-[calc(100vh-4rem)] overflow-y-auto px-8 py-8">
        
            {section === "overview" && (
                <div className="space-y-10">
                    {/* USER INFO */}
                    <div className="card">
                        <h2 className="text-2xl font-bold mb-4">👤 Profile</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Age:</strong> {user.age}</p>
                        <p><strong>Occupation:</strong> {user.occupation}</p>
                    </div>
                </div>

                {/* DAILY STREAK */}
                <div className="card flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-semibold">🔥 Daily Streak</h3>
                        <p className="text-gray-400">
                        Keep testing daily to maintain your streak
                        </p>

                        {user.streak > 0 && (
                        <p className="text-sm text-green-400">
                        You're on a {user.streak}-day streak! 🚀
                        </p>
                        )}

                    </div>

                    <div className="text-right">
                        <p className="text-4xl font-bold text-orange-400">
                        {user.streak}
                        </p>
                        <p className="text-sm text-gray-400">
                        Longest: {user.longestStreak}
                        </p>
                    </div>
                </div>

                {/* MindScore */}
                <div className="card flex items-center justify-between">
                    <div>
                    <h2 className="text-2xl font-bold">🧠 MindScore</h2>
                    <p className="text-gray-400">
                    Overall cognitive performance
                    </p>
                    <p className={`text-sm ${getMindScoreMeta(mindScore).color}`}>
                    {getMindScoreMeta(mindScore).label}
                    </p>
                    </div>

                    <div className="text-right">
                    <p className="text-5xl font-bold text-blue-400">
                    {mindScore ?? "--"}
                    </p>
                    <p className="text-sm text-gray-400">out of 100</p>
                    </div>
                </div>


                {/* HEATMAP */}
                <div className="card">
                    <h3 className="text-xl font-semibold mb-4">
                    📅 Activity Heatmap (Last 90 Days)
                    </h3>

                    <div className="overflow-x-auto">
                      <div className="w-fit">
                          <Heatmap data={heatmap} />
                      </div>
                    </div>
                </div>


                {/* TOTALS */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-2">📊 Overall</h2>
                    <p className="text-gray-400">
                    Total Tests Given:{" "}
                    <span className="font-semibold text-white">
                        {totals.allTests}
                    </span>
                    </p>
                </div>
                

                {/* AI Coach Card */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-3">🤖 AI Cognitive Coach</h2>

                    {aiLoading && (
                        <p className="text-gray-400">Analyzing your performance...</p>
                    )}

                    {!aiLoading && aiInsight && (
                        <pre className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                        {aiInsight}
                        </pre>
                    )}

                    {!aiLoading && !aiInsight && (
                        <p className="text-gray-400">
                        Complete more tests to unlock AI insights.
                        </p>
                    )}
                </div>
              </div>

            )}


            {section === "analytics" && (
                <div className="space-y-6">
                    {/* ATTENTION */}
                    <Accordion title={`🎯 Attention Test — Best: ${attention.best} ms`}>
                        <p>Total: {totals.attention}</p>
                        <p>Best Reaction Time: {attention.best} ms</p>
                        <p>Average Reaction Time: {attention.avg?.toFixed(2)} ms</p>

                        <p className="flex items-center gap-2">
                        Progress:
                        <ProgressBadge
                            trend={attentionProgress.trend}
                            percent={attentionProgress.percent}
                        />
                        </p>

                        {attention.last10.length > 0 && (
                        <StatGraph data={attention.last10} label="Reaction Time" />
                        )}

                        {/* <TestHistory data={attentionHistory} unit="ms" /> */}
                    </Accordion>



                    {/* MEMORY */}
                    <Accordion title={`🧠 Memory Test — Best: ${memory.best}%`}>
                        <p>Total: {totals.memory}</p>
                        <p>Best Accuracy: {memory.best}%</p>
                        <p>Average Accuracy: {memory.avg?.toFixed(2)}%</p>

                        <p className="flex items-center gap-2">
                        Progress:
                        <ProgressBadge
                            trend={memoryProgress.trend}
                            percent={memoryProgress.percent}
                        />
                        </p>

                        {memory.last10.length > 0 && (
                        <StatGraph data={memory.last10} label="Accuracy" />
                        )}

                        {/* <TestHistory data={memoryHistory} unit="%" /> */}
                    </Accordion>



                    {/* REACTION */}
                    <Accordion title={`⚡ Reaction Test — Best: ${reaction.best} ms`}>
                        <p>Total: {totals.reaction}</p>
                        <p>Best Reaction Time: {reaction.best} ms</p>
                        <p>Average Reaction Time: {reaction.avg?.toFixed(2)} ms</p>

                        <p className="flex items-center gap-2">
                        Progress:
                        <ProgressBadge
                            trend={reactionProgress.trend}
                            percent={reactionProgress.percent}
                        />
                        </p>

                        {reaction.last10.length > 0 && (
                        <StatGraph data={reaction.last10} label="Reaction Time" />
                        )}

                        {/* <TestHistory data={reactionHistory} unit="ms" /> */}
                    </Accordion>



                    {/* PROBLEM */}
                    <Accordion title={`➗ Problem Solving Test — Best: ${problem.best} problems`}>
                        <p>Total: {totals.problem}</p>
                        <p>Best Problems Solved: {problem.best}</p>
                        <p>Average Problems Solved: {problem.avg?.toFixed(2)}</p>

                        <p className="flex items-center gap-2">
                        Progress:
                        <ProgressBadge
                            trend={problemProgress.trend}
                            percent={problemProgress.percent}
                        />
                        </p>

                        {problem.last10.length > 0 && (
                        <StatGraph data={problem.last10} label="Problems Solved" />
                        )}

                        {/* <TestHistory data={problemHistory} unit="problems" /> */}
                    </Accordion>
                </div>
            )}

            {section === "history" && (
            <div className="space-y-8">
                <Accordion title="🎯 Attention History">
                <TestHistory data={attentionHistory} unit="ms" />
                </Accordion>

                <Accordion title="🧠 Memory History">
                <TestHistory data={memoryHistory} unit="%" />
                </Accordion>

                <Accordion title="⚡ Reaction History">
                <TestHistory data={reactionHistory} unit="ms" />
                </Accordion>

                <Accordion title="➗ Problem History">
                <TestHistory data={problemHistory} unit="problems" />
                </Accordion>
            </div>
            )}



            {section === "settings" && (
                <div className="space-y-8">
                    {/* USER INFO */}
                    <div className="card">
                        <h2 className="text-2xl font-bold mb-4">👤 Profile</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>

                        {!editing ? (
                            <>
                            <p><strong>Age:</strong> {user.age}</p>
                            <p><strong>Occupation:</strong> {user.occupation}</p>
                            </>
                        ) : (
                            <>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Age</label>
                                <input
                                type="number"
                                className="input"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">
                                Occupation
                                </label>
                                <input
                                type="text"
                                className="input"
                                value={occupation}
                                onChange={(e) => setOccupation(e.target.value)}
                                />
                            </div>
                            </>
                        )}
                        </div>

                            {/* Edit Profile */}
                        <div className="mt-4 flex gap-3">
                            {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                className="btn-secondary"
                            >
                                Edit Profile
                            </button>
                            ) : (
                            <>
                                <button
                                onClick={saveProfile}
                                disabled={saving}
                                className="btn-primary"
                                >
                                {saving ? "Saving..." : "Save"}
                                </button>

                                <button
                                onClick={() => {
                                    setEditing(false);
                                    setAge(user.age);
                                    setOccupation(user.occupation);
                                }}
                                className="btn-secondary"
                                >
                                Cancel
                                </button>
                            </>
                            )}
                        </div>
                    </div>


                    {/* Change Password */}
                    <div className="card mt-8">
                        <h3 className="text-xl font-semibold mb-4">🔐 Change Password</h3>

                        {!showPasswordForm ? (
                        <button
                            onClick={() => setShowPasswordForm(true)}
                            className="btn-secondary"
                        >
                            Change Password
                        </button>
                        ) : (
                        <div className="space-y-4 max-w-md">
                            <input
                            type="password"
                            placeholder="Current Password"
                            className="input"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            />

                            <input
                            type="password"
                            placeholder="New Password"
                            className="input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            />

                            <input
                            type="password"
                            placeholder="Confirm New Password"
                            className="input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            />

                            {passwordMsg && (
                            <p className="text-sm text-gray-400">{passwordMsg}</p>
                            )}

                            <div className="flex gap-3">
                            <button
                                onClick={changePassword}
                                disabled={passwordLoading}
                                className="btn-primary"
                            >
                                {passwordLoading ? "Updating..." : "Update Password"}
                            </button>

                            <button
                                onClick={() => setShowPasswordForm(false)}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                            </div>
                        </div>
                        )}
                    </div>

                    {/*
                    <div className="text-center">
                        <button onClick={logout} className="btn-secondary">
                        Logout
                        </button>
                    </div> */}
                </div>
            )}

        </main>
    </div>
    );

}