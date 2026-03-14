"use client";

import { useState, useCallback } from "react";

const SIZE = 32;

// Initialize from current favicon extraction (scaled up to 32x32)
function getInitialGrid(): boolean[][] {
  const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));

  // Paste the 16x16 design at 1:1 in the center of 32x32
  // (each old 2x2 block becomes individual pixels, offset by 8,4)
  const pixels16 = [
    "................",
    "................",
    "..##........##..",
    ".####.....####..",
    ".##.########.##.",
    "..#.########.#..",
    "..############..",
    "..###.####.###..",
    ".##..#....#..##.",
    "##............##",
    ".#....####....#.",
    "..##.##..##.##..",
    "....########....",
    "......####......",
    "................",
    "................",
  ];

  // Place at offset to center in 32x32
  const ox = 8, oy = 8;
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      if (pixels16[y][x] === "#") {
        // Scale each pixel to 2x2
        for (let dy = 0; dy < 2; dy++) {
          for (let dx = 0; dx < 2; dx++) {
            const gx = ox + x * 2 + dx - 8;
            const gy = oy + y * 2 + dy - 8;
            if (gx >= 0 && gx < SIZE && gy >= 0 && gy < SIZE) {
              grid[gy][gx] = true;
            }
          }
        }
      }
    }
  }

  return grid;
}

export default function EditorPage() {
  const [grid, setGrid] = useState<boolean[][]>(getInitialGrid);
  const [painting, setPainting] = useState<boolean | null>(null);

  const toggle = useCallback(
    (x: number, y: number) => {
      setGrid((prev) => {
        const next = prev.map((row) => [...row]);
        next[y][x] = painting !== null ? painting : !prev[y][x];
        return next;
      });
    },
    [painting]
  );

  const handleMouseDown = (x: number, y: number) => {
    const newVal = !grid[y][x];
    setPainting(newVal);
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[y][x] = newVal;
      return next;
    });
  };

  const handleMouseEnter = (x: number, y: number) => {
    if (painting !== null) {
      toggle(x, y);
    }
  };

  const handleMouseUp = () => setPainting(null);

  const exportSVG = () => {
    let rects = "";
    for (let y = 0; y < SIZE; y++) {
      let x = 0;
      while (x < SIZE) {
        if (grid[y][x]) {
          const start = x;
          while (x < SIZE && grid[y][x]) x++;
          rects += `  <rect x="${start}" y="${y}" width="${x - start}" height="1" fill="#fff"/>\n`;
        } else {
          x++;
        }
      }
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">\n  <rect width="32" height="32" fill="#000"/>\n${rects}</svg>`;

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "icon.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copySVG = () => {
    let rects = "";
    for (let y = 0; y < SIZE; y++) {
      let x = 0;
      while (x < SIZE) {
        if (grid[y][x]) {
          const start = x;
          while (x < SIZE && grid[y][x]) x++;
          rects += `  <rect x="${start}" y="${y}" width="${x - start}" height="1" fill="#fff"/>\n`;
        } else {
          x++;
        }
      }
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">\n  <rect width="32" height="32" fill="#000"/>\n${rects}</svg>`;
    navigator.clipboard.writeText(svg);
  };

  const clear = () => setGrid(Array.from({ length: SIZE }, () => Array(SIZE).fill(false)));

  const cellSize = 18;

  return (
    <div
      className="min-h-screen bg-black text-white flex flex-col items-center py-12 select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <h1 className="text-2xl font-bold mb-2">Favicon Editor</h1>
      <p className="font-mono text-xs text-white/40 mb-8">32x32 — click & drag to paint</p>

      <div className="flex gap-12">
        {/* Grid */}
        <div
          className="border border-white/20"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${SIZE}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${SIZE}, ${cellSize}px)`,
          }}
        >
          {grid.flatMap((row, y) =>
            row.map((on, x) => (
              <div
                key={`${x}-${y}`}
                onMouseDown={() => handleMouseDown(x, y)}
                onMouseEnter={() => handleMouseEnter(x, y)}
                className="cursor-crosshair"
                style={{
                  width: cellSize,
                  height: cellSize,
                  background: on ? "#fff" : "#111",
                  border: "1px solid #222",
                }}
              />
            ))
          )}
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center gap-6">
          <div>
            <p className="font-mono text-xs text-white/40 mb-2">Preview (actual size)</p>
            <svg viewBox="0 0 32 32" width="32" height="32">
              <rect width="32" height="32" fill="#000" />
              {grid.flatMap((row, y) =>
                row.map((on, x) =>
                  on ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#fff" /> : null
                )
              )}
            </svg>
          </div>

          <div>
            <p className="font-mono text-xs text-white/40 mb-2">Preview (4x)</p>
            <svg viewBox="0 0 32 32" width="128" height="128">
              <rect width="32" height="32" fill="#000" />
              {grid.flatMap((row, y) =>
                row.map((on, x) =>
                  on ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#fff" /> : null
                )
              )}
            </svg>
          </div>

          <div>
            <p className="font-mono text-xs text-white/40 mb-2">Preview (8x)</p>
            <svg viewBox="0 0 32 32" width="256" height="256">
              <rect width="32" height="32" fill="#000" />
              {grid.flatMap((row, y) =>
                row.map((on, x) =>
                  on ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#fff" /> : null
                )
              )}
            </svg>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <button onClick={exportSVG} className="font-mono text-xs border border-white/30 px-4 py-2 hover:bg-white hover:text-black transition-colors">
              Download SVG
            </button>
            <button onClick={copySVG} className="font-mono text-xs border border-white/30 px-4 py-2 hover:bg-white hover:text-black transition-colors">
              Copy SVG
            </button>
            <button onClick={clear} className="font-mono text-xs border border-white/30 px-4 py-2 hover:bg-red-500 hover:border-red-500 transition-colors">
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
