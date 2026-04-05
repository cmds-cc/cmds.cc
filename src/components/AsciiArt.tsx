import { useEffect, useRef, useState, useCallback } from "react";

const EDGE_CHARS = "@#$%&*";
const FILL_CHARS = "+=-~:;.";

interface AsciiArtProps {
  text: string;
  className?: string;
}

export default function AsciiArt({ text, className }: AsciiArtProps) {
  const [grid, setGrid] = useState<boolean[][] | null>(null);
  const [edges, setEdges] = useState<boolean[][] | null>(null);
  const [frame, setFrame] = useState(0);
  const [phase, setPhase] = useState<"reveal" | "live">("reveal");
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const preRef = useRef<HTMLPreElement>(null);
  const startTimeRef = useRef(performance.now());

  // Generate grid from canvas text rendering
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    // Render text large, then sample
    const fontSize = 80;
    ctx.font = `bold ${fontSize}px "JetBrains Mono", monospace`;
    const metrics = ctx.measureText(text);
    const w = Math.ceil(metrics.width) + 10;
    const h = fontSize + 20;

    canvas.width = w;
    canvas.height = h;

    ctx.font = `bold ${fontSize}px "JetBrains Mono", monospace`;
    ctx.fillStyle = "white";
    ctx.textBaseline = "top";
    ctx.fillText(text, 5, 10);

    const imageData = ctx.getImageData(0, 0, w, h);
    const pixels = imageData.data;

    // Sample at ~6px intervals to create ASCII grid
    const sampleSize = 6;
    const cols = Math.floor(w / sampleSize);
    const rows = Math.floor(h / sampleSize);

    const newGrid: boolean[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: boolean[] = [];
      for (let c = 0; c < cols; c++) {
        const px = Math.floor(c * sampleSize + sampleSize / 2);
        const py = Math.floor(r * sampleSize + sampleSize / 2);
        const idx = (py * w + px) * 4;
        const alpha = pixels[idx + 3];
        row.push(alpha > 80);
      }
      newGrid.push(row);
    }

    // Compute edges
    const newEdges: boolean[][] = newGrid.map((row, ri) =>
      row.map((filled, ci) => {
        if (!filled) return false;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = ri + dr;
            const nc = ci + dc;
            if (nr < 0 || nr >= newGrid.length || nc < 0 || nc >= row.length)
              return true;
            if (!newGrid[nr][nc]) return true;
          }
        }
        return false;
      }),
    );

    setGrid(newGrid);
    setEdges(newEdges);
    startTimeRef.current = performance.now();
    setPhase("reveal");
    setFrame(0);
  }, [text]);

  // Animation loop
  useEffect(() => {
    let raf: number;
    let lastTick = 0;

    function tick(now: number) {
      const elapsed = now - startTimeRef.current;

      if (phase === "reveal" && elapsed >= 1800) {
        setPhase("live");
      }

      if (now - lastTick >= 120) {
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

  if (!grid || !edges) return null;

  const elapsed = performance.now() - startTimeRef.current;
  const totalCols = grid[0]?.length || 0;
  const revealProgress = Math.min(elapsed / 1800, 1);
  const revealCol = Math.floor(
    revealProgress * revealProgress * (totalCols + 4),
  );

  const charW = 7.2;
  const charH = 13;

  const coloredLines = grid.map((row, ri) => {
    const spans: JSX.Element[] = [];
    let buf = "";
    let bufIsEdge = false;
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
        buf = " ";
        bufOpacity = 1;
        bufIsEdge = false;
        flush();
        return;
      }

      const edge = edges[ri][ci];
      const revealed = phase === "live" || ci <= revealCol;

      // Mouse proximity
      let mouseDist = Infinity;
      if (mousePos) {
        mouseDist = Math.sqrt(
          (mousePos.x - ci * charW) ** 2 + (mousePos.y - ri * charH) ** 2,
        );
      }
      const nearMouse = mouseDist < 40;

      let ch: string;
      let opacity: number;

      if (!revealed) {
        const idx = (ci + ri + frame * 2) % FILL_CHARS.length;
        ch = FILL_CHARS[idx];
        opacity = 0.15;
      } else if (nearMouse) {
        const allChars = EDGE_CHARS + FILL_CHARS;
        ch = allChars[(ci * 13 + ri * 7 + frame * 3) % allChars.length];
        opacity = edge ? 1 : 0.5;
      } else if (edge) {
        const noise = Math.sin(ci * 0.5 + ri * 0.8 + frame * 0.2);
        const idx =
          noise > 0.6
            ? (ci + ri + frame) % EDGE_CHARS.length
            : (ci + ri) % EDGE_CHARS.length;
        ch = EDGE_CHARS[idx];
        opacity = 1;
      } else {
        const noise = Math.sin(ci * 0.3 + ri * 0.7 + frame * 0.1);
        const idx =
          noise > 0.8
            ? (ci + ri + frame) % FILL_CHARS.length
            : (ci * 3 + ri * 7) % FILL_CHARS.length;
        ch = FILL_CHARS[idx];
        opacity = 0.35;
      }

      // Batch spans with same properties
      const thisIsEdge = !!edge;
      if (
        buf &&
        (thisIsEdge !== bufIsEdge || Math.abs(opacity - bufOpacity) > 0.01)
      ) {
        flush();
      }
      buf += ch;
      bufIsEdge = thisIsEdge;
      bufOpacity = opacity;
    });

    flush();

    return (
      <div key={ri} style={{ lineHeight: "13px", height: "13px" }}>
        {spans}
      </div>
    );
  });

  return (
    <pre
      ref={preRef}
      className={`select-none cursor-default inline-block text-[11px] leading-[13px] ${className ?? ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {coloredLines}
    </pre>
  );
}
