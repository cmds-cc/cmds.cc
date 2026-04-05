import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import ScrambleText from "../components/ScrambleText";

export default function Home() {
  return (
    <Layout accent="#22d3ee">
      <header className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <ScrambleText
          text="cmds.cc"
          className="text-4xl sm:text-5xl font-bold leading-tight mb-8 inline-block"
        />
        <p className="text-lg text-[var(--color-text)] mb-3">
          Tools for Claude Code
        </p>
        <p className="text-sm text-[var(--color-text-muted)] mb-12 max-w-lg mx-auto">
          Safety hooks, agent skills, and CLI tools — installable with one
          command.
        </p>
      </header>

      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to="/hooks"
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 hover:border-[var(--color-accent)] transition-colors block"
          >
            <h2 className="text-[var(--color-accent)] font-bold mb-2">
              /hooks
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] mb-3">
              Install Claude Code hooks from any GitHub repo. Safety guardrails,
              auto-formatting, audit logging, and more.
            </p>
            <code className="text-xs text-[var(--color-text)]">
              $ npx @cmds-cc/hooks add owner/repo
            </code>
          </Link>
          <Link
            to="/skills"
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 hover:border-[var(--color-accent)] transition-colors block"
          >
            <h2 className="text-[var(--color-accent)] font-bold mb-2">
              /skills
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] mb-3">
              Agent skills for Cisco UC, network engineering, and DevOps.
              Installable via skills.sh.
            </p>
            <code className="text-xs text-[var(--color-text)]">
              $ npx skills add sieteunoseis/skills.automate.builders
            </code>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
