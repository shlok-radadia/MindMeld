import { useEffect, useState } from "react";
import api from "../../api/axios";


function generateGrid() {
  const size = 36;
  const baseChar = Math.random() > 0.5 ? "O" : "0";
  const oddChar = baseChar === "O" ? "0" : "O";

  const oddIndex = Math.floor(Math.random() * size);

  const grid = Array.from({ length: size }, (_, i) => ({
    char: i === oddIndex ? oddChar : baseChar,
    isOdd: i === oddIndex,
  }));

  return grid;
}

export default function AttentionTest() {
  const [grid, setGrid] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);
  const [bestTime, setBestTime] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const g = generateGrid();
    setGrid(g);
    setStartTime(Date.now());
  }, []);

  const resetTest = () => {
    const g = generateGrid();
    setGrid(g);
    setStartTime(Date.now());
    setReactionTime(null);
    setBestTime(null);
    setCompleted(false);
  };

  const handleClick = async (cell) => {
    if (!cell.isOdd || completed) return;

    const rt = Date.now() - startTime;
    setReactionTime(rt);
    setCompleted(true);

    try {
      setLoading(true);

      
      await api.post("/api/attentiontests", {
        reactionTime: rt,
      });

      
      const best = await api.get("/api/attentiontests/best");
      setBestTime(best.data?.reactionTime ?? rt);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">🎯 Attention Test</h1>

      <p className="text-gray-400 mb-6">
        Find and click the character that looks different as fast as
        possible.
      </p>


      <div className="card">
        <div className="grid grid-cols-6 gap-3 justify-items-center">
          {grid.map((cell, idx) => (
            <button
              key={idx}
              onClick={() => handleClick(cell)}
              className="w-12 h-12 text-xl font-bold bg-gray-800 rounded hover:bg-gray-700 transition"
            >
              {cell.char}
            </button>
          ))}
        </div>
      </div>


      {completed && (
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

          <button
            onClick={resetTest}
            className="btn-secondary"
          >
            Try Again
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