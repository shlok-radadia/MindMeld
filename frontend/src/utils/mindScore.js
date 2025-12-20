export function clamp(value, min = 0, max = 100) {
  if (value == null || Number.isNaN(value)) return 0;
  return Math.min(Math.max(value, min), max);
}

export function memoryScore(avgAccuracy) {
  if (avgAccuracy == null) return null;
  return clamp(avgAccuracy);
}

export function reactionScore(avgReactionTime) {
  if (avgReactionTime == null) return null;

  const score = 100 - ((avgReactionTime - 200) / 500) * 100;
  return clamp(score);
}

export function problemScore(avgProblemsSolved) {
  if (avgProblemsSolved == null) return null;

  const score = (avgProblemsSolved / 20) * 100;
  return clamp(score);
}

export function calculateMindScore({
  memoryAvg,
  attentionAvg,
  reactionAvg,
  problemAvg,
}) {
  const scores = [
    memoryScore(memoryAvg),
    reactionScore(attentionAvg),
    reactionScore(reactionAvg),
    problemScore(problemAvg),
  ].filter((v) => v !== null);

  if (!scores.length) return null;

  const total =
    scores.reduce((sum, s) => sum + s, 0) / scores.length;

  return Math.round(total);
}

export function getMindScoreLabel(score) {
  if (score == null || Number.isNaN(score)) {
    return "No Data";
  }

  const safeScore = Math.max(0, Math.min(score, 100));

  if (safeScore >= 85) return "Elite 🏆";
  if (safeScore >= 70) return "Strong 💪";
  if (safeScore >= 50) return "Average 👍";
  return "Needs Practice 🚀";
}

export function getMindScoreMeta(score) {
  const label = getMindScoreLabel(score);

  const colorMap = {
    "Elite 🏆": "text-yellow-400",
    "Strong 💪": "text-green-400",
    "Average 👍": "text-blue-400",
    "Needs Practice 🚀": "text-red-400",
    "No Data": "text-gray-400",
  };

  return {
    label,
    color: colorMap[label],
  };
}