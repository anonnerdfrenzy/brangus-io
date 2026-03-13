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

    // Primary layer: 0=empty, 1=active, 2=trail, 3=text, 4=text-dissolving
    let state = new Uint8Array(cols * rows);
    let chemical = new Float32Array(cols * rows);
    let chemTemp = new Float32Array(cols * rows);
    let dissolve = new Float32Array(cols * rows);

    // Click-spawned layer: 0=empty, 1=active, 2=trail
    let state2 = new Uint8Array(cols * rows);
    let gen2 = new Uint16Array(cols * rows); // generation tag per cell
    let chem2 = new Float32Array(cols * rows);
    let chem2Temp = new Float32Array(cols * rows);
    let nextGen = 1;

    const idx = (x: number, y: number) => y * cols + x;
    const inBounds = (x: number, y: number) => x >= 0 && x < cols && y >= 0 && y < rows;

    const dirs = [
      [-1, -1], [0, -1], [1, -1],
      [-1, 0],           [1, 0],
      [-1, 1],  [0, 1],  [1, 1],
    ];

    function stampText() {
      const offscreen = document.createElement("canvas");
      offscreen.width = displayW;
      offscreen.height = displayH;
      const offCtx = offscreen.getContext("2d")!;
      const fontSize = Math.min(displayW / 5, 180);
      offCtx.font = `900 italic ${fontSize}px "Playfair Display", serif`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillStyle = "white";
      offCtx.fillText("BRANGUS", displayW / 2, displayH / 2);
      const imageData = offCtx.getImageData(0, 0, displayW, displayH);
      const pixels = imageData.data;
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const px = Math.floor(gx * SCALE + SCALE / 2);
          const py = Math.floor(gy * SCALE + SCALE / 2);
          if (px < displayW && py < displayH) {
            const pi = (py * displayW + px) * 4;
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
      state2.fill(0);
      chem2.fill(0);
      stampText();
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

    function spawnAt(gridX: number, gridY: number) {
      const g = nextGen++;
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          const x = gridX + dx;
          const y = gridY + dy;
          if (inBounds(x, y) && state2[idx(x, y)] === 0) {
            state2[idx(x, y)] = 1;
            gen2[idx(x, y)] = g;
            chem2[idx(x, y)] = 1.0;
          }
        }
      }
    }

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      spawnAt(Math.floor(px / SCALE), Math.floor(py / SCALE));
    };
    canvas.addEventListener("click", handleClick);

    document.fonts.ready.then(() => { seed(); });

    // Step the primary mold layer
    function stepPrimary() {
      // Diffuse
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let sum = chemical[idx(x, y)];
          let count = 1;
          for (const [dx, dy] of dirs) {
            const nx = x + dx, ny = y + dy;
            if (inBounds(nx, ny)) { sum += chemical[idx(nx, ny)]; count++; }
          }
          chemTemp[idx(x, y)] = (sum / count) * 0.93;
        }
      }
      [chemical, chemTemp] = [chemTemp, chemical];

      // Emitters
      for (let i = 0; i < state.length; i++) {
        if (state[i] === 3) chemical[i] = Math.min(1.0, chemical[i] + 0.18);
        else if (state[i] === 2) chemical[i] = Math.min(1.0, chemical[i] + 0.02);
      }

      const toTrail: number[] = [];
      const toActive: number[] = [];
      const toDissolve: number[] = [];

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = idx(x, y);
          if (state[i] === 4) {
            dissolve[i] += 0.03;
            chemical[i] = Math.max(0, chemical[i] - 0.02);
            if (dissolve[i] >= 1) state[i] = 0;
            continue;
          }
          if (state[i] !== 1) continue;

          chemical[i] = Math.min(1.0, chemical[i] + 0.4);
          const emptyNeighbors: [number, number][] = [];
          let touchesText = false;

          for (const [dx, dy] of dirs) {
            const nx = x + dx, ny = y + dy;
            if (!inBounds(nx, ny)) continue;
            const ns = state[idx(nx, ny)];
            if (ns === 3) { touchesText = true; toDissolve.push(idx(nx, ny)); }
            if (ns === 0) {
              let filledCount = 0;
              for (const [ddx, ddy] of dirs) {
                const nnx = nx + ddx, nny = ny + ddy;
                if (inBounds(nnx, nny)) {
                  const nns = state[idx(nnx, nny)];
                  if (nns === 1 || nns === 2) filledCount++;
                }
              }
              if (filledCount <= 2) emptyNeighbors.push([nx, ny]);
            }
          }

          if (emptyNeighbors.length === 0 && !touchesText) { toTrail.push(i); continue; }

          for (let j = emptyNeighbors.length - 1; j > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1));
            [emptyNeighbors[j], emptyNeighbors[k]] = [emptyNeighbors[k], emptyNeighbors[j]];
          }
          const growCount = (Math.random() < 0.15 && emptyNeighbors.length >= 2) ? 2 : 1;
          for (let j = 0; j < growCount && j < emptyNeighbors.length; j++) {
            toActive.push(idx(emptyNeighbors[j][0], emptyNeighbors[j][1]));
          }
          toTrail.push(i);
        }
      }

      for (const i of toDissolve) { if (state[i] === 3) { state[i] = 4; dissolve[i] = 0; } }
      for (const i of toTrail) state[i] = 2;
      for (const i of toActive) { if (state[i] === 0) state[i] = 1; }
    }

    // Step the click-spawned mold layer (independent, but attracted to primary trail)
    function stepSecondary() {
      // Diffuse chem2, but also bleed in a little from primary chemical
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let sum = chem2[idx(x, y)];
          let count = 1;
          for (const [dx, dy] of dirs) {
            const nx = x + dx, ny = y + dy;
            if (inBounds(nx, ny)) { sum += chem2[idx(nx, ny)]; count++; }
          }
          // Bleed in primary trail chemical for slight attraction
          chem2Temp[idx(x, y)] = (sum / count) * 0.93 + chemical[idx(x, y)] * 0.03;
        }
      }
      [chem2, chem2Temp] = [chem2Temp, chem2];

      const toTrail: number[] = [];
      const toActive: number[] = [];
      const newGen: number[] = [];
      const toDissolve: number[] = [];

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = idx(x, y);
          if (state2[i] !== 1) continue;

          const myGen = gen2[i];
          chem2[i] = Math.min(1.0, chem2[i] + 0.4);

          const emptyNeighbors: [number, number][] = [];

          for (const [dx, dy] of dirs) {
            const nx = x + dx, ny = y + dy;
            if (!inBounds(nx, ny)) continue;

            // Dissolve text on contact (but don't grow into it)
            const ps = state[idx(nx, ny)];
            if (ps === 3) {
              toDissolve.push(idx(nx, ny));
              continue;
            }
            // Also don't grow into dissolving text cells
            if (ps === 4) continue;

            if (state2[idx(nx, ny)] !== 0) continue;

            // Density check: only count cells from the SAME generation
            let filledCount = 0;
            for (const [ddx, ddy] of dirs) {
              const nnx = nx + ddx, nny = ny + ddy;
              if (inBounds(nnx, nny)) {
                const ni = idx(nnx, nny);
                if ((state2[ni] === 1 || state2[ni] === 2) && gen2[ni] === myGen) filledCount++;
              }
            }
            if (filledCount <= 2) emptyNeighbors.push([nx, ny]);
          }

          if (emptyNeighbors.length === 0) { toTrail.push(i); continue; }

          for (let j = emptyNeighbors.length - 1; j > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1));
            [emptyNeighbors[j], emptyNeighbors[k]] = [emptyNeighbors[k], emptyNeighbors[j]];
          }
          const growCount = (Math.random() < 0.15 && emptyNeighbors.length >= 2) ? 2 : 1;
          for (let j = 0; j < growCount && j < emptyNeighbors.length; j++) {
            const ni = idx(emptyNeighbors[j][0], emptyNeighbors[j][1]);
            toActive.push(ni);
            newGen.push(myGen); // propagate generation
          }
          toTrail.push(i);
        }
      }

      for (const i of toDissolve) {
        if (state[i] === 3) { state[i] = 4; dissolve[i] = 0; }
      }
      for (const i of toTrail) state2[i] = 2;
      for (let k = 0; k < toActive.length; k++) {
        const i = toActive[k];
        if (state2[i] === 0) {
          state2[i] = 1;
          gen2[i] = newGen[k];
        }
      }
    }

    function render() {
      ctx!.fillStyle = "#000000";
      ctx!.fillRect(0, 0, displayW, displayH);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = idx(x, y);
          const s = state[i];
          const s2 = state2[i];
          const c = chemical[i];
          const c2 = chem2[i];

          // Primary layer
          if (s === 3) {
            ctx!.fillStyle = "rgba(255,255,255,0.9)";
            ctx!.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
          } else if (s === 4) {
            const d = dissolve[i];
            const alpha = 0.85 * (1 - d);
            if (alpha > 0.01) {
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

          // Secondary layer (additive on top)
          if (s2 === 1) {
            ctx!.fillStyle = `rgba(255,255,255,${0.7 + c2 * 0.3})`;
            ctx!.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
          } else if (s2 === 2) {
            ctx!.fillStyle = `rgba(255,255,255,${0.1 + c2 * 0.4})`;
            ctx!.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
          }
        }
      }

      // Glow
      const fontSize = Math.min(displayW / 5, 180);
      ctx!.font = `900 italic ${fontSize}px "Playfair Display", serif`;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      ctx!.fillStyle = "rgba(0,0,0,0.001)";
      for (const layer of [
        { blur: 60, alpha: 0.15 },
        { blur: 30, alpha: 0.2 },
        { blur: 12, alpha: 0.25 },
      ]) {
        ctx!.save();
        ctx!.shadowColor = `rgba(255,255,255,${layer.alpha})`;
        ctx!.shadowBlur = layer.blur;
        ctx!.fillText("BRANGUS", displayW / 2, displayH / 2);
        ctx!.restore();
      }
    }

    let animationId: number;

    function loop() {
      stepPrimary();
      stepSecondary();
      render();
      animationId = requestAnimationFrame(loop);
    }

    document.fonts.ready.then(() => { loop(); });

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
      state2 = new Uint8Array(cols * rows);
      gen2 = new Uint16Array(cols * rows);
      chem2 = new Float32Array(cols * rows);
      chem2Temp = new Float32Array(cols * rows);
      nextGen = 1;
      seed();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
