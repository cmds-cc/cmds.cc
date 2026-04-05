import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import AsciiHero from "../components/AsciiHero";
import CopyButton from "../components/CopyButton";
import type { HookEntry } from "../types";

export default function Hooks() {
  const [hooks, setHooks] = useState<HookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/hooks")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data: HookEntry[]) => {
        setHooks(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <Layout accent="#facc15">
      <header className="max-w-3xl mx-auto px-6 pt-20 pb-10 text-center">
        <AsciiHero
          text="hooks"
          className="text-4xl sm:text-5xl font-bold leading-tight mb-8 inline-block"
        />
        <p className="text-lg text-[var(--color-text)] mb-3">
          Claude Code hooks from any GitHub repo
        </p>
        <p className="text-sm text-[var(--color-text-muted)] mb-8 max-w-lg mx-auto">
          Install guardrails, safety checks, and workflow automation into Claude
          Code with a single command.
        </p>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-3 inline-flex items-center gap-3">
          <code className="text-sm text-[var(--color-text)]">
            $ npx @cmds-cc/hooks add &lt;owner/repo&gt;
          </code>
          <CopyButton text="npx @cmds-cc/hooks add " />
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-sm font-bold text-[var(--color-text)]">
            Available Hooks
          </h2>
          {!loading && !error && (
            <span className="text-xs bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full px-2 py-0.5 text-[var(--color-text-muted)]">
              {hooks.length}
            </span>
          )}
        </div>

        {loading && (
          <p className="text-sm text-[var(--color-text-muted)]">Loading...</p>
        )}

        {error && (
          <p className="text-sm text-red-400">
            Failed to load hooks directory.
          </p>
        )}

        {!loading && !error && hooks.length === 0 && (
          <p className="text-sm text-[var(--color-text-muted)]">
            No hooks registered yet.
          </p>
        )}

        {!loading && !error && hooks.length > 0 && (
          <div className="space-y-3">
            {hooks.map((hook) => {
              const installCmd = `npx @cmds-cc/hooks add ${hook.repo}`;
              return (
                <div
                  key={hook.repo}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[var(--color-accent)] font-bold text-sm">
                        {hook.name}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)]">
                        v{hook.version}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {hook.hooks} hook{hook.hooks !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <a
                      href={`https://github.com/${hook.author}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors shrink-0"
                    >
                      @{hook.author}
                    </a>
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] mb-3">
                    {hook.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <code className="text-xs text-[var(--color-text)]">
                      $ {installCmd}
                    </code>
                    <CopyButton text={installCmd} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </Layout>
  );
}
