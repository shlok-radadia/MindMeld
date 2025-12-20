import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const tests = [
  {
    name: "Memory Test",
    path: "/tests/memory",
    description:
      "Test your ability to remember and recall information accurately.",
    icon: "🧠",
  },
  {
    name: "Attention Test",
    path: "/tests/attention",
    description:
      "Measure focus and attention by spotting subtle visual differences.",
    icon: "🎯",
  },
  {
    name: "Reaction Test",
    path: "/tests/reaction",
    description:
      "Check how fast you respond to visual stimuli.",
    icon: "⚡",
  },
  {
    name: "Problem Solving",
    path: "/tests/problem",
    description:
      "Solve as many math problems as you can in limited time.",
    icon: "➗",
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
        
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">
          Welcome{user?.username ? `, ${user.username}` : ""} 👋
        </h1>
        <p className="text-gray-400">
          Choose a test below to start training your cognitive skills.
        </p>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tests.map((test) => (
          <div key={test.name} className="card flex flex-col">
            <div className="text-4xl mb-4">{test.icon}</div>

            <h3 className="text-xl font-semibold mb-2">
              {test.name}
            </h3>

            <p className="text-gray-400 text-sm flex-1">
              {test.description}
            </p>

            <Link
              to={test.path}
              className="btn-primary mt-6 text-center"
            >
              Start Test
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}