interface MiniChartProps {
  data: number[];
  color: string;
  max?: number;
  height?: number;
}

export function MiniChart({ data, color, max = 100, height = 60 }: MiniChartProps) {
  const width = 300;
  if (data.length < 2) {
    return <svg width={width} height={height} className="w-full" />;
  }
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (Math.min(v, max) / max) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
