import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";


const TODAY_INSIGHTS = [
  "Consistency beats intensity. Short daily practice leads to lasting improvement.",
  "Most cognitive gains come from repetition, not difficulty.",
  "Your brain improves fastest when practice is spread across days.",
  "Reaction speed improves earlier than memory — stay patient.",
  "Small improvements compound over time.",
  "Cognitive performance is more about habits than talent.",
  "Rest days are as important as training days.",
  "Tracking progress increases long-term consistency.",
];

function getTodayKey() {
  return new Date().toDateString();
}

function getCachedAIInsight() {
  try {
    const cached = JSON.parse(localStorage.getItem("aiInsight"));
    if (!cached) return null;

    if (cached.date === getTodayKey()) {
      return cached.text;
    }
    return null;
  } catch {
    return null;
  }
}

function setCachedAIInsight(text) {
  localStorage.setItem(
    "aiInsight",
    JSON.stringify({
      date: getTodayKey(),
      text,
    })
  );
}

function clearCachedAIInsight() {
  localStorage.removeItem("aiInsight");
}


function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const tests = [
  {
    name: "Memory Test",
    path: "/tests/memory",
    description:
      "Train your ability to store and recall information accurately.",
    icon: "🧠",
    color: "from-purple-500 to-indigo-500",
  },
  {
    name: "Attention Test",
    path: "/tests/attention",
    description:
      "Sharpen focus by detecting patterns and visual changes.",
    icon: "🎯",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Reaction Test",
    path: "/tests/reaction",
    description:
      "Measure how quickly your brain responds to stimuli.",
    icon: "⚡",
    color: "from-yellow-500 to-orange-500",
  },
  {
    name: "Problem Solving",
    path: "/tests/problem",
    description:
      "Improve logic and mental speed under pressure.",
    icon: "➗",
    color: "from-blue-500 to-cyan-500",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [aiInsight, setAiInsight] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const todaysInsight = useMemo(
    () => getRandomItem(TODAY_INSIGHTS),
    []
  )

  const fetchAIInsight = () => {
    if (!profileData) return;

    const { memory, attention, reaction, problem, user } = profileData;

    if (
      memory?.avg == null ||
      attention?.avg == null ||
      reaction?.avg == null ||
      problem?.avg == null
    ) {
      setAiInsight("Complete more tests to unlock AI insights.");
      return;
    }

    setAiLoading(true);

    // console.log("Fetching AI insight with payload:", {
    //   memoryAvg: memory.avg,
    //   attentionAvg: attention.avg,
    //   reactionAvg: reaction.avg,
    //   problemAvg: problem.avg,
    //   streak: user.streak,
    // });


    api
      .post("/api/ai/insight", {
        memoryAvg: memory.avg,
        attentionAvg: attention.avg,
        reactionAvg: reaction.avg,
        problemAvg: problem.avg,
        streak: user.streak,
        trend: "improving",
      })
      .then((res) => {
        // console.log("AI response:", res.data);
        const insight = res.data.insight || "AI insight unavailable.";

        setAiInsight(insight);
        setCachedAIInsight(insight);
      })
      .catch(() => {
        setAiInsight("AI insight unavailable.");
      })
      .finally(() => {
        setAiLoading(false);
      });
  };


  useEffect(() => {
    api
      .get("/api/profiles")
      .then(res => setProfileData(res.data))
      .catch(() => setProfileData(null));
  }, []);


  useEffect(() => {
    if (!profileData) return;

    const cached = getCachedAIInsight();
    if (cached) {
      setAiInsight(cached);
      return;
    }

    fetchAIInsight();
  }, [profileData]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-14">

      <section className="relative card flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />

        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back{user?.username ? `, ${user.username}` : ""} 👋
          </h1>
          <p className="text-gray-400 max-w-xl">
            Train consistently to sharpen memory, focus, reaction speed, and
            problem solving. Small daily gains compound over time.
          </p>
        </div>

        <div className="relative max-w-sm bg-gray-900/60 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-400 text-lg">🧠</span>
            <span className="text-xs uppercase tracking-wide text-gray-400">
              Today's Insight
            </span>
          </div>

          <p className="text-gray-200 text-sm leading-relaxed italic">
            “{todaysInsight}”
          </p>
        </div>
      </section>


      <section className="flex flex-col gap-6">
        <div className="card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none" />

          <div className="relative space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-wide text-gray-400">
                Daily Streak
              </p>

              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-lg">
                🔥
              </div>
            </div>

            <div>
              <h3 className="text-4xl font-bold text-orange-400 leading-none">
                {user.streak}
                <span className="text-base font-medium text-gray-300 ml-1">
                  days
                </span>
              </h3>

              <p className="text-sm text-gray-400 mt-1">
                Longest streak:{" "}
                <span className="text-gray-200 font-medium">
                  {user.longestStreak} days
                </span>
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Next milestone</span>
                <span>{user.streak + 1} days</span>
              </div>

              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
                  style={{
                    width: `${Math.min((user.streak % 7) * 14, 100)}%`,
                  }}
                />
              </div>
            </div>

            <p className="text-xs text-gray-400">
              {user.streak >= 7
                ? "Elite consistency — keep pushing"
                : user.streak >= 3
                ? "Momentum building — stay consistent"
                : "Start strong today"}
            </p>
          </div>
        </div>


        <div className="card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none" />

          <div className="relative flex flex-col h-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center text-lg">
                  🤖
                </div>
                <p className="text-sm uppercase tracking-wide text-gray-400">
                  AI Training Insight
                </p>
              </div>

              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">
                Personalized
              </span>
            </div>

            <div className="flex-1">
              {aiLoading ? (
                <p className="text-gray-400 text-sm animate-pulse">
                  Analyzing your performance...
                </p>
              ) : aiInsight ? (
                <div className="text-gray-200 text-base leading-relaxed font-medium whitespace-pre-line">
                  {aiInsight.replace(/\*\*/g, "").replace(/\* /g, "- ")}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  Complete more tests to unlock AI-powered insights.
                </p>
              )}
            </div>

            <button
              onClick={() => {
                clearCachedAIInsight();
                fetchAIInsight();
              }}
              disabled={aiLoading}
              className="mt-3 inline-flex items-center gap-2 text-xs
                        px-3 py-1.5 rounded-md
                        border border-blue-500/30
                        text-blue-400
                        hover:bg-blue-500/10
                        transition
                        disabled:opacity-50 disabled:cursor-not-allowed
                        cursor-pointer"
            >
              🔄 Refresh Insight
            </button>


            <div className="h-px bg-gray-800" />

            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Based on your performance</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Updates daily
              </span>
            </div>
          </div>
        </div>


      </section>



      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
      
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">
          Choose a test to begin
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tests.map((test) => (
            <div
              key={test.name}
              className="relative rounded-xl border border-gray-800 bg-[var(--bg-card)] p-6
                        hover:border-blue-500/40 hover:-translate-y-1
                        transition-all duration-300 group"
            >
              
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${test.color}
                            flex items-center justify-center text-2xl mb-4`}
              >
                {test.icon}
              </div>


              <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition">
                {test.name}
              </h3>


              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                {test.description}
              </p>


              <Link
                to={test.path}
                className="inline-flex items-center justify-center w-full
                          rounded-lg bg-blue-500/10 text-blue-400
                          hover:bg-blue-500 hover:text-white
                          transition px-4 py-2 text-sm font-medium"
              >
                Start Test →
              </Link>
            </div>
          ))}
        </div>
      </section>


      <section className="card bg-gradient-to-br from-gray-900/60 to-gray-800/40">
        <h3 className="text-xl font-semibold mb-6">
          Why train your mind?
        </h3>

        <div className="grid sm:grid-cols-2 gap-4 text-gray-400 text-sm">
          <p>🧠 Stronger memory improves learning efficiency</p>
          <p>🎯 Better focus boosts productivity</p>
          <p>⚡ Faster reactions improve decision making</p>
          <p>📈 Consistency compounds cognitive growth</p>
        </div>
      </section>
    </div>
  );
}
