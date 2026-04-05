import { useEffect, useRef, useState, useCallback, useMemo } from "react";

const EDGE_CHARS = "*%$#@&";
const FILL_CHARS = "+=-~:;.";

interface AsciiHeroProps {
  text: string;
  className?: string;
}

export default function AsciiHero({ text, className }: AsciiHeroProps) {
  const [grid, setGrid] = useState<boolean[][] | null>(null);
  const [edges, setEdges] = useState<boolean[][] | null>(null);
  const [frame, setFrame] = useState(0);
  const [phase, setPhase] = useState<"reveal" | "live">("reveal");
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const preRef = useRef<HTMLPreElement>(null);
  const startTimeRef = useRef(performance.now());

  // Generate high-res grid from canvas
  useEffect(() => {
    // Wait for font to load
    document.fonts.ready.then(() => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      const fontSize = 160;
      const font = `bold ${fontSize}px "JetBrains Mono", monospace`;
      ctx.font = font;
      const metrics = ctx.measureText(text);

      const padding = 8;
      const w = Math.ceil(metrics.width) + padding * 2;
      const h = fontSize + padding * 2;

      canvas.width = w;
      canvas.height = h;

      // Re-set font after canvas resize
      ctx.font = font;
      ctx.fillStyle = "white";
      ctx.textBaseline = "top";
      ctx.fillText(text, padding, padding);

      const imageData = ctx.getImageData(0, 0, w, h);
      const pixels = imageData.data;

      // Sample densely — each ASCII char represents a 4x7 pixel block
      // This gives ~2:1 aspect ratio correction for monospace chars
      const cellW = 4;
      const cellH = 7;
      const cols = Math.floor(w / cellW);
      const rows = Math.floor(h / cellH);

      const newGrid: boolean[][] = [];
      for (let r = 0; r < rows; r++) {
        const row: boolean[] = [];
        for (let c = 0; c < cols; c++) {
          // Average the alpha in this cell
          let totalAlpha = 0;
          let samples = 0;
          for (let dy = 0; dy < cellH; dy++) {
            for (let dx = 0; dx < cellW; dx++) {
              const px = c * cellW + dx;
              const py = r * cellH + dy;
              if (px < w && py < h) {
                const idx = (py * w + px) * 4;
                totalAlpha += pixels[idx + 3];
                samples++;
              }
            }
          }
          row.push(totalAlpha / samples > 60);
        }
        newGrid.push(row);
      }

      // Trim empty rows from top and bottom
      let topTrim = 0;
      while (topTrim < newGrid.length && newGrid[topTrim].every((c) => !c))
        topTrim++;
      let bottomTrim = newGrid.length - 1;
      while (bottomTrim > 0 && newGrid[bottomTrim].every((c) => !c))
        bottomTrim--;
      const trimmed = newGrid.slice(topTrim, bottomTrim + 1);

      // Trim empty cols from left and right
      let leftTrim = Infinity;
      let rightTrim = 0;
      for (const row of trimmed) {
        const first = row.indexOf(true);
        const last = row.lastIndexOf(true);
        if (first !== -1) leftTrim = Math.min(leftTrim, first);
        if (last !== -1) rightTrim = Math.max(rightTrim, last);
      }
      if (leftTrim === Infinity) leftTrim = 0;
      const finalGrid = trimmed.map((row) =>
        row.slice(leftTrim, rightTrim + 1),
      );

      // Compute edges
      const newEdges = finalGrid.map((row, ri) =>
        row.map((filled, ci) => {
          if (!filled) return false;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = ri + dr;
              const nc = ci + dc;
              if (
                nr < 0 ||
                nr >= finalGrid.length ||
                nc < 0 ||
                nc >= row.length
              )
                return true;
              if (!finalGrid[nr][nc]) return true;
            }
          }
          return false;
        }),
      );

      setGrid(finalGrid);
      setEdges(newEdges);
      startTimeRef.current = performance.now();
      setPhase("reveal");
      setFrame(0);
    });
  }, [text]);

  // Animation loop
  useEffect(() => {
    let raf: number;
    let lastTick = 0;

    function tick(now: number) {
      if (phase === "reveal" && now - startTimeRef.current >= 1800) {
        setPhase("live");
      }
      if (now - lastTick >= 110) {
        setFrame((f) => f + 1);
        lastTick = now;
      }
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLPreElement>) => {
    if (!preRef.current) return;
    const rect = preRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleMouseLeave = useCallback(() => setMousePos(null), []);

  if (!grid || !edges) {
    return (
      <pre
        className={`text-[var(--color-accent)] select-none cursor-default text-4xl sm:text-5xl font-bold ${className ?? ""}`}
      >
        {text}
      </pre>
    );
  }

  const elapsed = performance.now() - startTimeRef.current;
  const totalCols = grid[0]?.length || 0;
  const revealProgress = Math.min(elapsed / 1800, 1);
  const revealCol = Math.floor(
    revealProgress * revealProgress * (totalCols + 6),
  );

  const charW = 5.8;
  const charH = 10;

  const renderedLines = useMemo(() => {
    return grid.map((row, ri) => {
      const spans: JSX.Element[] = [];
      let buf = "";
      let bufOpacity = 1;

      const flush = () => {
        if (!buf) return;
        spans.push(
          <span
            key={spans.length}
            className="text-[var(--color-accent)]"
            style={{ opacity: bufOpacity }}
          >
            {buf}
          </span>,
        );
        buf = "";
      };

      row.forEach((filled, ci) => {
        if (!filled) {
          flush();
          spans.push(<span key={`s${ci}`}> </span>);
          return;
        }

        const isEdge = edges![ri][ci];
        const revealed = phase === "live" || ci <= revealCol;

        let mouseDist = Infinity;
        if (mousePos) {
          mouseDist = Math.sqrt(
            (mousePos.x - ci * charW) ** 2 + (mousePos.y - ri * charH) ** 2,
          );
        }
        const nearMouse = mouseDist < 30;

        let ch: string;
        let opacity: number;

        if (!revealed) {
          ch = FILL_CHARS[(ci + ri + frame * 2) % FILL_CHARS.length];
          opacity = 0.12;
        } else if (nearMouse) {
          const all = EDGE_CHARS + FILL_CHARS;
          ch = all[(ci * 13 + ri * 7 + frame * 3) % all.length];
          opacity = isEdge ? 1 : 0.5;
        } else if (isEdge) {
          const noise = Math.sin(ci * 0.5 + ri * 0.8 + frame * 0.15);
          ch =
            noise > 0.7
              ? EDGE_CHARS[(ci + ri + frame) % EDGE_CHARS.length]
              : EDGE_CHARS[(ci + ri) % EDGE_CHARS.length];
          opacity = 1;
        } else {
          const noise = Math.sin(ci * 0.3 + ri * 0.7 + frame * 0.08);
          ch =
            noise > 0.85
              ? FILL_CHARS[(ci + ri + frame) % FILL_CHARS.length]
              : FILL_CHARS[(ci * 3 + ri * 7) % FILL_CHARS.length];
          opacity = 0.35;
        }

        if (buf && Math.abs(opacity - bufOpacity) > 0.01) {
          flush();
        }
        buf += ch;
        bufOpacity = opacity;
      });

      flush();

      return (
        <div key={ri} style={{ lineHeight: "10px", height: "10px" }}>
          {spans}
        </div>
      );
    });
  }, [grid, edges, frame, phase, revealCol, mousePos]);

  return (
    <pre
      ref={preRef}
      className={`select-none cursor-default inline-block text-[9px] ${className ?? ""}`}
      style={{ lineHeight: "10px", letterSpacing: "0px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {renderedLines}
    </pre>
  );
}
