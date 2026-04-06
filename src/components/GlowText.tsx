import { useEffect, useRef, useState, useCallback } from "react";

const ANSI_SHADOW: Record<string, string> = {
  "cmds.cc": ` ██████╗███╗   ███╗██████╗ ███████╗    ██████╗ ██████╗
██╔════╝████╗ ████║██╔══██╗██╔════╝   ██╔════╝██╔════╝
██║     ██╔████╔██║██║  ██║███████╗   ██║     ██║
██║     ██║╚██╔╝██║██║  ██║╚════██║   ██║     ██║
╚██████╗██║ ╚═╝ ██║██████╔╝███████║██╗╚██████╗╚██████╗
 ╚═════╝╚═╝     ╚═╝╚═════╝ ╚══════╝╚═╝ ╚═════╝ ╚═════╝`,
  hooks: `██╗  ██╗ ██████╗  ██████╗ ██╗  ██╗███████╗
██║  ██║██╔═══██╗██╔═══██╗██║ ██╔╝██╔════╝
███████║██║   ██║██║   ██║█████╔╝ ███████╗
██╔══██║██║   ██║██║   ██║██╔═██╗ ╚════██║
██║  ██║╚██████╔╝╚██████╔╝██║  ██╗███████║
╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝`,
  skills: `███████╗██╗  ██╗██╗██╗     ██╗     ███████╗
██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝
███████╗█████╔╝ ██║██║     ██║     ███████╗
╚════██║██╔═██╗ ██║██║     ██║     ╚════██║
███████║██║  ██╗██║███████╗███████╗███████║
╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝`,
  mcp: `███╗   ███╗ ██████╗██████╗
████╗ ████║██╔════╝██╔══██╗
██╔████╔██║██║     ██████╔╝
██║╚██╔╝██║██║     ██╔═══╝
██║ ╚═╝ ██║╚██████╗██║
╚═╝     ╚═╝ ╚═════╝╚═╝     `,
};

const SCRAMBLE_CHARS = "░▒▓█▀▄▌▐╬╠╣╦╩═║╗╝╚╔";

function randomChar(): string {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

interface GlowTextProps {
  text: string;
  className?: string;
}

export default function GlowText({ text, className }: GlowTextProps) {
  const art = ANSI_SHADOW[text.toLowerCase()] || text;
  const lines = art.split("\n");

  const [chars, setChars] = useState(() =>
    [...art].map((ch) => ({
      target: ch,
      current: ch === " " || ch === "\n" ? ch : randomChar(),
      resolved: ch === " " || ch === "\n",
    })),
  );

  const preRef = useRef<HTMLPreElement>(null);
  const resolvedRef = useRef(false);
  const animFrameRef = useRef<number>(0);

  // Resolve animation on mount
  useEffect(() => {
    const totalChars = chars.filter((c) => !c.resolved).length;
    const duration = 1500;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const resolveUpTo = Math.floor(progress * totalChars);

      setChars((prev) => {
        let count = 0;
        return prev.map((ch) => {
          if (ch.target === " " || ch.target === "\n") return ch;
          count++;
          if (count <= resolveUpTo) {
            return { ...ch, current: ch.target, resolved: true };
          }
          return { ...ch, current: randomChar() };
        });
      });

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        resolvedRef.current = true;
      }
    }

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [text]);

  // Mouse hover scramble
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLPreElement>) => {
      if (!resolvedRef.current || !preRef.current) return;

      const pre = preRef.current;
      const rect = pre.getBoundingClientRect();
      const style = getComputedStyle(pre);
      const fontSize = parseFloat(style.fontSize);
      const charWidth = fontSize * 0.6;
      const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.4;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const lineIndex = Math.floor(y / lineHeight);
      const colIndex = Math.floor(x / charWidth);

      let flatIndex = 0;
      for (let i = 0; i < lineIndex && i < lines.length; i++) {
        flatIndex += lines[i].length + 1;
      }
      flatIndex += colIndex;

      const radius = 5;

      setChars((prev) =>
        prev.map((ch, i) => {
          if (ch.target === " " || ch.target === "\n") return ch;
          const dist = Math.abs(i - flatIndex);
          if (dist <= radius) {
            return { ...ch, current: randomChar(), resolved: false };
          }
          return { ...ch, current: ch.target, resolved: true };
        }),
      );
    },
    [text, lines],
  );

  // Mouse leave — re-resolve
  const handleMouseLeave = useCallback(() => {
    if (!resolvedRef.current) return;
    const startTime = performance.now();
    const duration = 400;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setChars((prev) => {
        const unresolved = prev.filter((c) => !c.resolved);
        const resolveUpTo = Math.floor(progress * unresolved.length);
        let count = 0;

        return prev.map((ch) => {
          if (ch.resolved) return ch;
          count++;
          if (count <= resolveUpTo) {
            return { ...ch, current: ch.target, resolved: true };
          }
          return { ...ch, current: randomChar() };
        });
      });

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    }

    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  const display = chars.map((c) => c.current).join("");

  return (
    <pre
      ref={preRef}
      className={`select-none cursor-default glow-text ${className ?? ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {display}
    </pre>
  );
}
