export function getProgress(values, higherIsBetter = true) {
    // console.log(values);
  if (!values || values.length < 2) {
    return {
      trend: "neutral",
      delta: 0,
      percent: 0,
    };
  }

  const current = values[0].value;
  const previous = values[1].value;

  const diff = current - previous;
  const percent =
    previous !== 0 ? ((diff / previous) * 100).toFixed(1) : 0;

  let trend = "neutral";

  if (higherIsBetter) {
    if (diff > 0) trend = "up";
    else if (diff < 0) trend = "down";
  } else {
    
    if (diff < 0) trend = "up";
    else if (diff > 0) trend = "down";
  }

  return {
    trend,
    delta: diff,
    percent,
  };
}