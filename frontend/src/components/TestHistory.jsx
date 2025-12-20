export default function TestHistory({ data, unit }) {
  if (!data.length) {
    return (
      <p className="text-gray-400 text-sm">No attempts yet</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-gray-400 border-b border-gray-700">
          <tr>
            <th className="py-2">Date</th>
            <th className="py-2">Score</th>
            <th className="py-2">Trend</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => {
            const prev = data[index + 1]?.value;
            const trend =
              prev !== undefined
                ? item.value > prev
                  ? "↑"
                  : item.value < prev
                  ? "↓"
                  : "→"
                : "-";

            return (
              <tr
                key={index}
                className="border-b border-gray-800"
              >
                <td className="py-2">
                  {new Date(item.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>
                <td className="py-2 font-medium">
                  {item.value} {unit}
                </td>
                <td className="py-2">
                  <span
                    className={
                      trend === "↑"
                        ? "text-green-400"
                        : trend === "↓"
                        ? "text-red-400"
                        : "text-gray-400"
                    }
                  >
                    {trend}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}