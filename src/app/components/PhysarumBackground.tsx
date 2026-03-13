"use client";

import { useEffect, useRef } from "react";

const SCALE = 4;

export default function PhysarumBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let displayW = window.innerWidth;
    let displayH = window.innerHeight;
    canvas.width = displayW;
    canvas.height = displayH;

    let cols = Math.ceil(displayW / SCALE);
    let rows = Math.ceil(displayH / SCALE);

    // States: 0=empty, 1=active, 2=trail, 3=text, 4=text-dissolving
    let state = new Uint8Array(cols * rows);
    let chemical = new Float32Array(cols * rows);
    let chemTemp = new Float32Array(cols * rows);
    let dissolve = new Float32Array(cols * rows); // dissolve progress 0-1

    const idx = (x: number, y: number) => y * cols + x;
    const inBounds = (x: number, y: number) => x >= 0 && x < cols && y >= 0 && y < rows;

    const dirs = [
      [-1, -1], [0, -1], [1, -1],
      [-1, 0],           [1, 0],
      [-1, 1],  [0, 1],  [1, 1],
    ];

    // Render "BRANGUS" text to an offscreen canvas, sample into grid
    function stampText() {
      const offscreen = document.createElement("canvas");
      offscreen.width = displayW;
      offscreen.height = displayH;
      const offCtx = offscreen.getContext("2d")!;

      // Try to use Playfair Display, fallback to serif
      const fontSize = Math.min(displayW / 5, 180);
      offCtx.font = `900 italic ${fontSize}px "Playfair Display", serif`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillStyle = "white";
      offCtx.fillText("BRANGUS", displayW / 2, displayH / 2);

      const imageData = offCtx.getImageData(0, 0, displayW, displayH);
      const pixels = imageData.data;

      // Sample pixels at grid resolution
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const px = Math.floor(gx * SCALE + SCALE / 2);
          const py = Math.floor(gy * SCALE + SCALE / 2);
          if (px < displayW && py < displayH) {
            const pi = (py * displayW + px) * 4;
            // If pixel is white-ish (text), mark as text cell
            if (pixels[pi] > 128) {
              state[idx(gx, gy)] = 3;
              dissolve[idx(gx, gy)] = 0;
            }
          }
        }
      }
    }

    function seed() {
      state.fill(0);
      chemical.fill(0);
      dissolve.fill(0);

      // Stamp text first
      stampText();

      // Seed cluster in bottom-left
      for (let dy = 0; dy < 6; dy++) {
        for (let dx = 0; dx < 6; dx++) {
          const x = dx;
          const y = rows - 1 - dy;
          if (inBounds(x, y) && state[idx(x, y)] !== 3) {
            state[idx(x, y)] = 1;
            chemical[idx(x, y)] = 1.0;
          }
        }
      }
    }

    // Wait for font to load before seeding
    document.fonts.ready.then(() => {
      seed();
    });

    function step() {
      // 1. Diffuse chemical
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let sum = chemical[idx(x, y)];
          let count = 1;
          for (const [dx, dy] of dirs) {
            const nx = x + dx, ny = y + dy;
            if (inBounds(nx, ny)) {
              sum += chemical[idx(nx, ny)];
              count++;
            }
          }
          chemTemp[idx(x, y)] = (sum / count) * 0.93;
        }
      }
      [chemical, chemTemp] = [chemTemp, chemical];

      // 2. Process active cells
      const toTrail: number[] = [];
      const toActive: number[] = [];
      const toDissolve: number[] = [];

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = idx(x, y);

          // Progress dissolving text
          if (state[i] === 4) {
            dissolve[i] += 0.03;
            chemical[i] = Math.max(0, chemical[i] - 0.02);
            if (dissolve[i] >= 1) {
              state[i] = 0; // fully dissolved -> empty
            }
            continue;
          }

          if (state[i] !== 1) continue;

          // Deposit chemical
          chemical[i] = Math.min(1.0, chemical[i] + 0.4);

          // Find growable neighbors (empty or text)
          const emptyNeighbors: [number, number][] = [];
          let touchesText = false;

          for (const [dx, dy] of dirs) {
            const nx = x + dx, ny = y + dy;
            if (!inBounds(nx, ny)) continue;

            const ns = state[idx(nx, ny)];

            // If neighbor is text, mark it for dissolving
            if (ns === 3) {
              touchesText = true;
              toDissolve.push(idx(nx, ny));
            }

            if (ns === 0) {
              let filledCount = 0;
              for (const [ddx, ddy] of dirs) {
                const nnx = nx + ddx, nny = ny + ddy;
                if (inBounds(nnx, nny) && state[idx(nnx, nny)] > 0 && state[idx(nnx, nny)] !== 3) {
                  filledCount++;
                }
              }
              if (filledCount <= 2) {
                emptyNeighbors.push([nx, ny]);
              }
            }
          }

          if (emptyNeighbors.length === 0 && !touchesText) {
            toTrail.push(i);
            continue;
          }

          // Shuffle
          for (let j = emptyNeighbors.length - 1; j > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1));
            [emptyNeighbors[j], emptyNeighbors[k]] = [emptyNeighbors[k], emptyNeighbors[j]];
          }

          const branchChance = 0.15;
          const growCount = (Math.random() < branchChance && emptyNeighbors.length >= 2) ? 2 : 1;

          for (let j = 0; j < growCount && j < emptyNeighbors.length; j++) {
            const [nx, ny] = emptyNeighbors[j];
            toActive.push(idx(nx, ny));
          }

          toTrail.push(i);
        }
      }

      for (const i of toDissolve) {
        if (state[i] === 3) {
          state[i] = 4; // start dissolving
          dissolve[i] = 0;
        }
      }
      for (const i of toTrail) state[i] = 2;
      for (const i of toActive) {
        if (state[i] === 0) state[i] = 1;
      }
    }

    function render() {
      ctx!.fillStyle = "#000000";
      ctx!.fillRect(0, 0, displayW, displayH);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = idx(x, y);
          const s = state[i];
          const c = chemical[i];

          if (s === 3) {
            // Solid text
            ctx!.fillStyle = "rgba(255,255,255,0.85)";
            ctx!.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
          } else if (s === 4) {
            // Dissolving text - fade out and scatter
            const d = dissolve[i];
            const alpha = 0.85 * (1 - d);
            if (alpha > 0.01) {
              // Jitter position as it dissolves
              const jitter = d * 3;
              const jx = (Math.random() - 0.5) * jitter;
              const jy = (Math.random() - 0.5) * jitter;
              ctx!.fillStyle = `rgba(255,255,255,${alpha})`;
              ctx!.fillRect(x * SCALE + jx, y * SCALE + jy, SCALE, SCALE);
            }
          } else if (s === 1) {
            ctx!.fillStyle = `rgba(255,255,255,${0.7 + c * 0.3})`;
            ctx!.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
          } else if (s === 2) {
            ctx!.fillStyle = `rgba(255,255,255,${0.1 + c * 0.4})`;
            ctx!.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
          } else if (c > 0.02) {
            ctx!.fillStyle = `rgba(255,255,255,${c * 0.12})`;
            ctx!.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
          }
        }
      }
    }

    let animationId: number;

    function loop() {
      step();
      render();
      animationId = requestAnimationFrame(loop);
    }

    // Start loop after font is ready
    document.fonts.ready.then(() => {
      loop();
    });

    const handleResize = () => {
      displayW = window.innerWidth;
      displayH = window.innerHeight;
      canvas.width = displayW;
      canvas.height = displayH;
      cols = Math.ceil(displayW / SCALE);
      rows = Math.ceil(displayH / SCALE);
      state = new Uint8Array(cols * rows);
      chemical = new Float32Array(cols * rows);
      chemTemp = new Float32Array(cols * rows);
      dissolve = new Float32Array(cols * rows);
      seed();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
