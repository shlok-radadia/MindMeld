export default function Heatmap({ data, days = 91 }) {
  const today = new Date();
  const squares = [];


  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const key = date.toISOString().slice(0, 10);
    const count = data[key] || 0;

    squares.push({ key, count });
  }

  const getColor = (count) => {
    if (count === 0) return "bg-gray-800";
    if (count <= 10) return "bg-green-300";
    if (count <= 30) return "bg-green-500";
    if (count <= 50) return "bg-green-700";
    return "bg-green-900";
  };

  return (
    <div className="grid grid-rows-7 grid-flow-col gap-1">
      {squares.map(({ key, count }) => (
        <div
          key={key}
          title={`${key}: ${count} tests`}
          className={`w-4 h-4 rounded ${getColor(count)}`}
        />
      ))}
    </div>
  );
}