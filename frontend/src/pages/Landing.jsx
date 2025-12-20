import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-4xl text-center">
        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Train your mind with{" "}
          <span className="text-blue-500">MindMeld</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-400 mb-10">
          Measure, analyze, and improve your cognitive abilities through
          scientifically inspired mental tests — memory, attention, reaction,
          and problem solving.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup" className="btn-primary text-lg">
            Get Started
          </Link>
          <Link to="/login" className="btn-secondary text-lg">
            Login
          </Link>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">🧠 Memory</h3>
            <p className="text-gray-400">
              Test and improve your recall accuracy with structured memory
              challenges.
            </p>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-2">⚡ Reaction</h3>
            <p className="text-gray-400">
              Measure your reaction speed and track improvements over time.
            </p>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-2">🎯 Focus</h3>
            <p className="text-gray-400">
              Sharpen attention and concentration through visual detection
              tasks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}