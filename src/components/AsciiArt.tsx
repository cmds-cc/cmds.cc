import { useEffect, useRef, useState, useCallback, useMemo } from "react";

// Pre-generated figlet banner3 font output
const FIGLET: Record<string, string> = {
  "cmds.cc": ` ######  ##     ## ########   ######       ######   ######
##    ## ###   ### ##     ## ##    ##     ##    ## ##    ##
##       #### #### ##     ## ##           ##       ##
##       ## ### ## ##     ##  ######      ##       ##
##       ##     ## ##     ##       ##     ##       ##
##    ## ##     ## ##     ## ##    ## ### ##    ## ##    ##
 ######  ##     ## ########   ######  ###  ######   ######  `,
  hooks: `##     ##  #######   #######  ##    ##  ######
##     ## ##     ## ##     ## ##   ##  ##    ##
##     ## ##     ## ##     ## ##  ##   ##
######### ##     ## ##     ## #####     ######
##     ## ##     ## ##     ## ##  ##         ##
##     ## ##     ## ##     ## ##   ##  ##    ##
##     ##  #######   #######  ##    ##  ######  `,
  skills: ` ######  ##    ## #### ##       ##        ######
##    ## ##   ##   ##  ##       ##       ##    ##
##       ##  ##    ##  ##       ##       ##
 ######  #####     ##  ##       ##        ######
      ## ##  ##    ##  ##       ##             ##
##    ## ##   ##   ##  ##       ##       ##    ##
 ######  ##    ## #### ######## ########  ######  `,
  mcp: `##     ##  ######  ########
###   ### ##    ## ##     ##
#### #### ##       ##     ##
## ### ## ##       ########
##     ## ##       ##
##     ## ##    ## ##
##     ##  ######  ##        `,
};

const EDGE_CHARS = "*%$#@&";
const FILL_CHARS = "+=-~:;.";

interface AsciiArtProps {
  text: string;
  className?: string;
}

export default function AsciiArt({ text, className }: AsciiArtProps) {
  const lines = useMemo(() => {
    const raw = FIGLET[text.toLowerCase()] || text;
    return raw.split("\n");
  }, [text]);

  // Build grid: which cells are filled, which are edges
  const { filled, edges } = useMemo(() => {
    const f = lines.map((line) => [...line].map((ch) => ch === "#"));
    const e = f.map((row, ri) =>
      row.map((cell, ci) => {
        if (!cell) return false;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = ri + dr;
            const nc = ci + dc;
            if (nr < 0 || nr >= f.length || nc < 0 || nc >= row.length)
              return true;
            if (!f[nr][nc]) return true;
          }
        }
        return false;
      }),
    );
    return { filled: f, edges: e };
  }, [lines]);

  const [frame, setFrame] = useState(0);
  const [phase, setPhase] = useState<"reveal" | "live">("reveal");
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const preRef = useRef<HTMLPreElement>(null);
  const startTimeRef = useRef(performance.now());

  useEffect(() => {
    startTimeRef.current = performance.now();
    setPhase("reveal");
    setFrame(0);
  }, [text]);

  useEffect(() => {
    let raf: number;
    let lastTick = 0;

    function tick(now: number) {
      if (phase === "reveal" && now - startTimeRef.current >= 1500) {
        setPhase("live");
      }
      if (now - lastTick >= 100) {
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

  const elapsed = performance.now() - startTimeRef.current;
  const totalCols = Math.max(...lines.map((l) => l.length));
  const revealProgress = Math.min(elapsed / 1500, 1);
  const revealCol = Math.floor(
    revealProgress * revealProgress * (totalCols + 4),
  );

  // Approximate char dimensions at the display font size
  const charW = 6.6;
  const charH = 14;

  const renderedLines = filled.map((row, ri) => {
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

    const lineStr = lines[ri] || "";

    for (let ci = 0; ci < lineStr.length; ci++) {
      const isFilled = row[ci];
      const isEdge = edges[ri][ci];

      if (!isFilled) {
        flush();
        spans.push(<span key={spans.length}>{lineStr[ci]}</span>);
        continue;
      }

      const revealed = phase === "live" || ci <= revealCol;

      // Mouse proximity
      let mouseDist = Infinity;
      if (mousePos) {
        mouseDist = Math.sqrt(
          (mousePos.x - ci * charW) ** 2 + (mousePos.y - ri * charH) ** 2,
        );
      }
      const nearMouse = mouseDist < 35;

      let ch: string;
      let opacity: number;

      if (!revealed) {
        ch = FILL_CHARS[(ci + ri + frame * 2) % FILL_CHARS.length];
        opacity = 0.15;
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
        opacity = 0.4;
      }

      if (buf && Math.abs(opacity - bufOpacity) > 0.01) {
        flush();
      }
      buf += ch;
      bufOpacity = opacity;
    }

    flush();

    return (
      <div key={ri} className="whitespace-pre" style={{ lineHeight: "14px" }}>
        {spans}
      </div>
    );
  });

  return (
    <pre
      ref={preRef}
      className={`select-none cursor-default inline-block text-[11px] ${className ?? ""}`}
      style={{ lineHeight: "14px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {renderedLines}
    </pre>
  );
}
