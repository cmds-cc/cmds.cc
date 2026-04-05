import { useEffect, useRef, useState, useCallback } from "react";

const CHARS = "@#$%&*~+=<>[]{}|/\\";

interface CharState {
  target: string;
  current: string;
  resolved: boolean;
}

function randomChar(): string {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

interface ScrambleTextProps {
  text: string;
  className?: string;
}

export default function ScrambleText({ text, className }: ScrambleTextProps) {
  const [chars, setChars] = useState<CharState[]>(() =>
    [...text].map((ch) => ({
      target: ch,
      current: ch === " " || ch === "\n" ? ch : randomChar(),
      resolved: ch === " " || ch === "\n",
    })),
  );

  const preRef = useRef<HTMLPreElement>(null);
  const resolvedRef = useRef(false);
  const animFrameRef = useRef<number>(0);

  // Initial resolve animation
  useEffect(() => {
    const totalChars = chars.filter((c) => !c.resolved).length;
    const duration = 1500;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const resolveUpTo = Math.floor(progress * totalChars);

      setChars((prev) => {
        let unresolvedCount = 0;
        return prev.map((ch) => {
          if (ch.target === " " || ch.target === "\n") return ch;
          unresolvedCount++;
          if (unresolvedCount <= resolveUpTo) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // Hover scramble effect
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLPreElement>) => {
      if (!resolvedRef.current || !preRef.current) return;

      const pre = preRef.current;
      const rect = pre.getBoundingClientRect();
      const style = getComputedStyle(pre);
      const fontSize = parseFloat(style.fontSize);
      const charWidth = fontSize * 0.6;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.5;

      const lines = text.split("\n");
      const lineIndex = Math.floor(y / lineHeight);
      const colIndex = Math.floor(x / charWidth);

      let flatIndex = 0;
      for (let i = 0; i < lineIndex && i < lines.length; i++) {
        flatIndex += lines[i].length + 1;
      }
      flatIndex += colIndex;

      const radius = 3;

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
    [text],
  );

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
        let unresolvedCount = 0;

        return prev.map((ch) => {
          if (ch.resolved) return ch;
          unresolvedCount++;
          if (unresolvedCount <= resolveUpTo) {
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
      className={`text-[var(--color-accent)] select-none cursor-default ${className ?? ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {display}
    </pre>
  );
}
