import React, { useMemo } from "react";
import { cn } from "~/lib/utils";

export const BackgroundRippleEffect = ({
  rows = 8,
  cols = 27,
  cellSize = 56,
  className,
}: {
  rows?: number;
  cols?: number;
  cellSize?: number;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full",
        "[--cell-border-color:var(--color-neutral-300)] [--cell-fill-color:var(--color-neutral-100)] dark:[--cell-border-color:var(--color-neutral-700)] dark:[--cell-fill-color:var(--color-neutral-900)]",
      )}
    >
      <DivGrid
        className={cn(
          "mask-radial-from-20% mask-radial-at-top opacity-600",
          className,
        )}
        rows={rows}
        cols={cols}
        cellSize={cellSize}
        borderColor="var(--cell-border-color)"
        fillColor="var(--cell-fill-color)"
      />
    </div>
  );
};

type DivGridProps = {
  className?: string;
  rows: number;
  cols: number;
  cellSize: number;
  borderColor: string;
  fillColor: string;
};

const DivGrid = ({
  className,
  rows = 7,
  cols = 30,
  cellSize = 56,
  borderColor = "#3f3f46",
  fillColor = "rgba(14,165,233,0.3)",
}: DivGridProps) => {
  const cells = useMemo(
    () => Array.from({ length: rows * cols }, (_, idx) => idx),
    [rows, cols],
  );

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    width: cols * cellSize,
    height: rows * cellSize,
    marginInline: "auto",
  };

  return (
    <div className={cn("relative z-3", className)} style={gridStyle}>
      {cells.map((idx) => (
        <div
          key={idx}
          className={cn(
            "cell relative border-[0.5px] opacity-40 will-change-transform dark:shadow-[0px_0px_40px_1px_var(--cell-shadow-color)_inset]",
          )}
          style={{ backgroundColor: fillColor, borderColor: borderColor }}
        />
      ))}
    </div>
  );
};
