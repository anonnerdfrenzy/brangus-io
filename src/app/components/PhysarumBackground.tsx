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

    // 0 = empty, 1 = active (growing front), 2 = trail
    let state = new Uint8Array(cols * rows);
    let chemical = new Float32Array(cols * rows);
    let chemTemp = new Float32Array(cols * rows);

    const idx = (x: number, y: number) => y * cols + x;
    const inBounds = (x: number, y: number) => x >= 0 && x < cols && y >= 0 && y < rows;

    // Cardinal + diagonal neighbors
    const dirs = [
      [-1, -1], [0, -1], [1, -1],
      [-1, 0],           [1, 0],
      [-1, 1],  [0, 1],  [1, 1],
    ];

    function seed() {
      state.fill(0);
      chemical.fill(0);
      // Small seed cluster in bottom-left
      for (let dy = 0; dy < 6; dy++) {
        for (let dx = 0; dx < 6; dx++) {
          const x = dx;
          const y = rows - 1 - dy;
          if (inBounds(x, y)) {
            state[idx(x, y)] = 1;
            chemical[idx(x, y)] = 1.0;
          }
        }
      }
    }
    seed();

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

      // 2. Growth: each active cell tries to grow into empty neighbors
      // Key: sometimes grow into 2 neighbors (BRANCH)
      const toTrail: number[] = [];
      const toActive: number[] = [];

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (state[idx(x, y)] !== 1) continue;

          // Deposit chemical
          chemical[idx(x, y)] = Math.min(1.0, chemical[idx(x, y)] + 0.4);

          // Find empty neighbors
          const emptyNeighbors: [number, number][] = [];
          for (const [dx, dy] of dirs) {
            const nx = x + dx, ny = y + dy;
            if (inBounds(nx, ny) && state[idx(nx, ny)] === 0) {
              // Don't grow into cells surrounded by too much trail
              let filledCount = 0;
              for (const [ddx, ddy] of dirs) {
                const nnx = nx + ddx, nny = ny + ddy;
                if (inBounds(nnx, nny) && state[idx(nnx, nny)] > 0) filledCount++;
              }
              if (filledCount <= 2) {
                emptyNeighbors.push([nx, ny]);
              }
            }
          }

          if (emptyNeighbors.length === 0) {
            toTrail.push(idx(x, y));
            continue;
          }

          // Shuffle empty neighbors
          for (let i = emptyNeighbors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [emptyNeighbors[i], emptyNeighbors[j]] = [emptyNeighbors[j], emptyNeighbors[i]];
          }

          // Decide: grow into 1 neighbor, or branch into 2
          const branchChance = 0.15;
          const growCount = (Math.random() < branchChance && emptyNeighbors.length >= 2) ? 2 : 1;

          for (let i = 0; i < growCount && i < emptyNeighbors.length; i++) {
            const [nx, ny] = emptyNeighbors[i];
            toActive.push(idx(nx, ny));
          }

          // This cell becomes trail
          toTrail.push(idx(x, y));
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

          if (s === 1) {
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

    loop();

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
