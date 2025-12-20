import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  const containerRef = useRef(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const sections = Array.from(container.children);

    const onWheel = (e) => {
      e.preventDefault();

      if (isScrolling.current) return;
      isScrolling.current = true;

      const direction = e.deltaY > 0 ? 1 : -1;
      const currentIndex = Math.round(
        container.scrollTop / window.innerHeight
      );

      const nextIndex = Math.min(
        Math.max(currentIndex + direction, 0),
        sections.length - 1
      );

      container.scrollTo({
        top: nextIndex * window.innerHeight,
        behavior: "smooth",
      });
      isScrolling.current = false;
      // setTimeout(() => {
      //   isScrolling.current = false;
      // }, 800);
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div ref={containerRef} className="landing-container">
      
      {/* HERO */}
      <section className="landing-section">
        <div className="max-w-6xl text-center px-6 space-y-8">
          <h1 className="text-6xl md:text-7xl font-extrabold leading-tight">
            Train your mind with{" "}
            <span className="text-blue-500">MindMeld</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A science-inspired cognitive training platform to measure, analyze,
            and improve memory, attention, reaction speed, and problem solving —
            all in one place.
          </p>

          <div className="flex gap-4 justify-center">
            <Link to="/signup" className="btn-primary text-lg px-8 py-3">
              Start Free Training
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-3">
              Login
            </Link>
          </div>

          <div className="flex justify-center gap-8 text-sm text-gray-500">
            <span>✔ No ads</span>
            <span>✔ Free to use</span>
            <span>✔ Progress tracking</span>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="landing-section bg-[var(--bg-card)] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Built for measurable improvement
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Every number reflects real cognitive activity and consistent training.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: "🧠",
                value: "4",
                label: "Core Skills",
                sub: "Memory, focus, speed, logic",
              },
              {
                icon: "🤖",
                value: "AI",
                label: "Personalized Insights",
                sub: "Generated from your real performance data",
              },
              {
                icon: "🔥",
                value: "Daily",
                label: "Streak System",
                sub: "Consistency over intensity",
              },
              {
                icon: "📈",
                value: "100%",
                label: "Progress Tracking",
                sub: "Visual analytics & trends",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="group card text-center transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="text-4xl mb-3">{stat.icon}</div>

                <p className="text-4xl font-extrabold text-blue-400 mb-1">
                  {stat.value}
                </p>

                <p className="text-sm uppercase tracking-wide text-gray-400">
                  {stat.label}
                </p>

                <p className="text-xs text-gray-500 mt-2">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* FEATURES */}
      <section className="landing-section">
        <div className="max-w-6xl px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Train what actually matters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-2">🧠 Memory Training</h3>
              <p className="text-gray-400">
                Improve recall accuracy using word-based and pattern-based memory
                challenges with measurable performance tracking.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold mb-2">🎯 Attention Control</h3>
              <p className="text-gray-400">
                Strengthen focus and reduce distractions using reaction-based visual
                attention tasks.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold mb-2">⚡ Reaction Speed</h3>
              <p className="text-gray-400">
                Measure and improve response time through precision reaction tests
                backed by analytics.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold mb-2">➗ Problem Solving</h3>
              <p className="text-gray-400">
                Train logical thinking and mental speed with timed challenges and
                performance scoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="landing-section bg-[var(--bg-card)]">
        <div className="max-w-6xl px-6 mx-auto">
          <h2 className="text-4xl font-bold text-center mb-14">
            How <span className="text-blue-500">MindMeld</span> helps you improve
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            <div className="card hover:scale-[1.02] transition">
              <div className="text-3xl mb-3">🧪</div>
              <h3 className="text-xl font-semibold mb-2">
                Cognitive Testing
              </h3>
              <p className="text-gray-400">
                Take scientifically inspired tests for memory, attention, reaction
                speed, and problem solving.
              </p>
            </div>

            <div className="card hover:scale-[1.02] transition">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-xl font-semibold mb-2">
                Instant Feedback
              </h3>
              <p className="text-gray-400">
                Get immediate performance insights, scores, and breakdowns after every
                test.
              </p>
            </div>

            <div className="card hover:scale-[1.02] transition">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="text-xl font-semibold mb-2">
                Progress Tracking
              </h3>
              <p className="text-gray-400">
                Visualize improvement over time using graphs, trends, and activity
                heatmaps.
              </p>
            </div>

            <div className="card hover:scale-[1.02] transition">
              <div className="text-3xl mb-3">🔥</div>
              <h3 className="text-xl font-semibold mb-2">
                Streaks & Consistency
              </h3>
              <p className="text-gray-400">
                Build daily streaks that keep you motivated and disciplined.
              </p>
            </div>

            <div className="card hover:scale-[1.02] transition">
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="text-xl font-semibold mb-2">
                MindScore Overview
              </h3>
              <p className="text-gray-400">
                Get a single MindScore that summarizes your overall cognitive health.
              </p>
            </div>

            <div className="card hover:scale-[1.02] transition">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="text-xl font-semibold mb-2">
                AI Insights
              </h3>
              <p className="text-gray-400">
                Receive personalized AI-powered insights to understand strengths and
                improve weak areas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LEADERBOARD */}
      <section className="landing-section">
        <div className="max-w-5xl px-6 mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Compete with minds like yours
          </h2>

          <p className="text-gray-400 text-lg mb-8 max-w-3xl mx-auto">
            Compare your MindScore with others, climb the leaderboard, and push
            yourself to improve consistently.
          </p>

          <Link
            to="/leaderboard"
            className="btn-secondary text-lg px-10 py-4 inline-flex items-center gap-3"
          >
            🏆 View Leaderboard
          </Link>

          <p className="mt-4 text-sm text-gray-500">
            Rankings update automatically as users train
          </p>
        </div>
      </section>


      {/* CTA */}
      <section className="landing-section">
        <div className="text-center px-6 space-y-6">
          <h2 className="text-4xl font-bold">
            Build a sharper mind — one test at a time
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Whether you're a student, developer, or problem solver, MindMeld helps
            you train consistency, focus, and cognitive speed.
          </p>

          <Link to="/signup" className="btn-primary text-lg px-10 py-4">
            Create Free Account
          </Link>
        </div>
      </section>


    </div>
  );
}