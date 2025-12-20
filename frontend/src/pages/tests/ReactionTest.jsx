import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";

export default function ReactionTest() {
  const [status, setStatus] = useState("waiting");
  const [reactionTime, setReactionTime] = useState(null);
  const [bestTime, setBestTime] = useState(null);
  const [loading, setLoading] = useState(false);

  const startTimeRef = useRef(null);
  const timeoutRef = useRef(null);

  
  useEffect(() => {
    startTest();
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const startTest = () => {
    setStatus("waiting");
    setReactionTime(null);
    setBestTime(null);

    const delay = Math.floor(Math.random() * 3000) + 2000;

    timeoutRef.current = setTimeout(() => {
      setStatus("ready");
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = async () => {
    
    if (status === "waiting") {
      clearTimeout(timeoutRef.current);
      setStatus("too-soon");
      return;
    }

    
    if (status === "ready") {
      const rt = Date.now() - startTimeRef.current;
      setReactionTime(rt);
      setStatus("clicked");

      try {
        setLoading(true);

        
        await api.post("/api/reactiontests", {
          reactionTime: rt,
        });

        
        const best = await api.get("/api/reactiontests/best");
        setBestTime(best.data?.reactionTime ?? rt);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">⚡ Reaction Test</h1>

      <p className="text-gray-400 mb-6">
        Click the box as soon as it turns green. Don’t click too early!
      </p>


      <div
        onClick={handleClick}
        className={`flex items-center justify-center rounded-xl text-xl font-semibold cursor-pointer select-none transition-colors duration-200
          ${
            status === "waiting"
              ? "bg-red-700"
              : status === "ready"
              ? "bg-green-600"
              : status === "too-soon"
              ? "bg-yellow-600"
              : "bg-gray-800"
          }
        `}
        style={{ height: "220px" }}
      >
        {status === "waiting" && "Wait for green..."}
        {status === "ready" && "CLICK!"}
        {status === "too-soon" && "Too soon! Click to retry"}
        {status === "clicked" && "Done"}
      </div>


      {reactionTime !== null && (
        <div className="card mt-6 text-center space-y-3">
          <h2 className="text-2xl font-bold">
            Reaction Time: {reactionTime} ms
          </h2>

          {bestTime !== null && (
            <p className="text-gray-400">
              Best Reaction Time:{" "}
              <span className="text-blue-400 font-semibold">
                {bestTime} ms
              </span>
            </p>
          )}

          <button onClick={startTest} className="btn-secondary">
            Try Again
          </button>
        </div>
      )}

      {status === "too-soon" && (
        <div className="text-center mt-4">
          <button onClick={startTest} className="btn-secondary">
            Restart Test
          </button>
        </div>
      )}

      {loading && (
        <p className="text-center text-gray-400 mt-4">
          Saving result...
        </p>
      )}
    </div>
  );
}