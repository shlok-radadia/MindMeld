import { useEffect, useState } from "react";
import api from "../../api/axios";
import MEMORY_WORDS from "../../data/memoryWords";

function getRandomWords() {
  return [...MEMORY_WORDS].sort(() => 0.5 - Math.random()).slice(0, 10);
}

export default function MemoryTest() {
  const [words, setWords] = useState([]);
  const [step, setStep] = useState("show");
  const [timeLeft, setTimeLeft] = useState(10);
  const [answers, setAnswers] = useState("");
  const [accuracy, setAccuracy] = useState(null);
  const [bestAccuracy, setBestAccuracy] = useState(null);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    setWords(getRandomWords());
  }, []);

  
  useEffect(() => {
    if (step !== "show") return;

    if (timeLeft === 0) {
      setStep("input");
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, step]);

  const resetTest = () => {
    setWords(getRandomWords());
    setStep("show");
    setTimeLeft(10);
    setAnswers("");
    setAccuracy(null);
    setBestAccuracy(null);
  };

  const submitAnswers = async () => {
    const userWords = answers
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    const correct = words.filter((w) => userWords.includes(w)).length;
    const acc = Math.round((correct / words.length) * 100);

    setAccuracy(acc);
    setStep("result");

    try {
      setLoading(true);

      
      await api.post("/api/memorytests", { accuracy: acc });

      
      const best = await api.get("/api/memorytests/best");
      setBestAccuracy(best.data?.accuracy ?? acc);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">🧠 Memory Test</h1>


      {step === "show" && (
        <div className="card text-center">
          <p className="text-gray-400 mb-4">
            Memorize these words ({timeLeft}s)
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-lg font-semibold">
            {words.map((word) => (
              <div
                key={word}
                className="bg-gray-800 rounded-lg py-2"
              >
                {word}
              </div>
            ))}
          </div>
        </div>
      )}


      {step === "input" && (
        <div className="card">
          <p className="text-gray-400 mb-4">
            Type all the words you remember (space separated)
          </p>

          <textarea
            rows={4}
            className="input resize-none"
            placeholder="apple river chair..."
            value={answers}
            onChange={(e) => setAnswers(e.target.value)}
          />

          <button
            onClick={submitAnswers}
            className="btn-primary mt-4"
          >
            Submit
          </button>
        </div>
      )}


      {step === "result" && (
        <div className="card text-center space-y-4">
          <h2 className="text-2xl font-bold">
            Accuracy: {accuracy}%
          </h2>

          {bestAccuracy !== null && (
            <p className="text-gray-400">
              Best Accuracy:{" "}
              <span className="text-blue-400 font-semibold">
                {bestAccuracy}%
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