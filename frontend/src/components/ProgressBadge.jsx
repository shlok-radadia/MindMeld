export default function ProgressBadge({ trend, percent }) {
  if (trend === "neutral") {
    return (
      <span className="text-gray-400 text-sm">
        No change
      </span>
    );
  }

  const styles =
    trend === "up"
      ? "text-green-400"
      : "text-red-400";

  const arrow = trend === "up" ? "↑" : "↓";

  return (
    <span className={`text-sm font-medium ${styles}`}>
      {arrow} {Math.abs(percent)}%
    </span>
  );
}