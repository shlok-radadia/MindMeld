import { useEffect, useState, useRef } from "react";
import api from "../../api/axios";

function generateQuestion() {
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  const operators = ["+", "-", "*"];
  const op = operators[Math.floor(Math.random() * operators.length)];

  let answer;
  if (op === "+") answer = a + b;
  if (op === "-") answer = a - b;
  if (op === "*") answer = a * b;

  return {
    text: `${a} ${op} ${b}`,
    answer,
  };
}

export default function ProblemTest() {
  const hasSubmittedRef = useRef(false);


  const [timeLeft, setTimeLeft] = useState(60);
  const [question, setQuestion] = useState(generateQuestion());
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [bestScore, setBestScore] = useState(null);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (timeLeft === 0) {
      finishTest();
      return;
    }
    if (finished) return;

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, finished]);

  const submitAnswer = (e) => {
    e.preventDefault();

    
    if (input.trim() === "") return;

    const userAnswer = Number(input);

    
    if (Number.isNaN(userAnswer)) return;

    if (userAnswer === question.answer) {
      setScore((s) => s + 1);
    }

    
    setInput("");
    setQuestion(generateQuestion());
  };


  const finishTest = async () => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;

    setFinished(true);

    try {
      setLoading(true);

      
      await api.post("/api/problemtests", {
        problemsSolved: score,
      });

      
      const best = await api.get("/api/problemtests/best");
      setBestScore(best.data?.problemsSolved ?? score);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const restartTest = () => {
    hasSubmittedRef.current = false;
    setTimeLeft(60);
    setScore(0);
    setInput("");
    setFinished(false);
    setQuestion(generateQuestion());
    setBestScore(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">➗ Problem Solving Test</h1>

      <p className="text-gray-400 mb-6">
        Solve as many math problems as you can in 60 seconds.
      </p>


      <div className="flex justify-between items-center mb-6">
        <div className="text-lg">
          ⏱ Time left:{" "}
          <span className="font-semibold">{timeLeft}s</span>
        </div>
        <div className="text-lg">
          ✅ Solved:{" "}
          <span className="font-semibold">{score}</span>
        </div>
      </div>


      {!finished && (
        <div className="card text-center">
          <h2 className="text-3xl font-bold mb-4">
            {question.text}
          </h2>

          <form
            onSubmit={submitAnswer}
            className="flex gap-3 justify-center"
          >
            <input
              type="number"
              className="input w-32 text-center"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />

            <button type="submit" className="btn-primary">
              Submit
            </button>
          </form>
        </div>
      )}


      {finished && (
        <div className="card text-center space-y-4">
          <h2 className="text-2xl font-bold">
            Problems Solved: {score}
          </h2>

          {bestScore !== null && (
            <p className="text-gray-400">
              Best Score:{" "}
              <span className="text-blue-400 font-semibold">
                {bestScore}
              </span>
            </p>
          )}

          <button onClick={restartTest} className="btn-secondary">
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