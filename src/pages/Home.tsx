import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import GlowText from "../components/GlowText";

export default function Home() {
  return (
    <Layout accent="#22d3ee">
      <header className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <GlowText text="cmds" className="mb-2 inline-block" />
        <p className="text-sm text-[var(--color-accent)] font-bold mb-6 tracking-widest">
          .cc
        </p>
        <p className="text-lg text-[var(--color-text)] mb-3">
          Commands for Claude Code
        </p>
        <p className="text-sm text-[var(--color-text-muted)] mb-12 max-w-lg mx-auto">
          Safety hooks, agent skills, and CLI tools — installable with one
          command.
        </p>
      </header>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            to="/hooks"
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5 hover:border-[#facc15] transition-colors flex flex-col"
          >
            <h2 className="text-[#facc15] font-bold mb-2">/hooks</h2>
            <p className="text-sm text-[var(--color-text-muted)] flex-1 mb-3">
              Safety guardrails for CLI tools. Block destructive commands,
              auto-format code, and more.
            </p>
            <div className="bg-[var(--color-bg)] rounded px-2 py-1.5">
              <code className="text-xs text-[var(--color-text)] whitespace-nowrap">
                $ npx @cmds-cc/hooks add &lt;owner/repo&gt;
              </code>
            </div>
          </Link>
          <Link
            to="/skills"
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5 hover:border-[#4ade80] transition-colors flex flex-col"
          >
            <h2 className="text-[#4ade80] font-bold mb-2">/skills</h2>
            <p className="text-sm text-[var(--color-text-muted)] flex-1 mb-3">
              Agent skills for Cisco UC, network engineering, and DevOps.
            </p>
            <div className="bg-[var(--color-bg)] rounded px-2 py-1.5">
              <code className="text-xs text-[var(--color-text)] whitespace-nowrap">
                $ npx skills add &lt;owner/repo&gt;
              </code>
            </div>
          </Link>
          <Link
            to="/mcp"
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5 hover:border-[#c084fc] transition-colors flex flex-col"
          >
            <h2 className="text-[#c084fc] font-bold mb-2">/mcp</h2>
            <p className="text-sm text-[var(--color-text-muted)] flex-1 mb-3">
              MCP servers for Cisco Support APIs. Connect Claude to bug search,
              case management, and more.
            </p>
            <div className="bg-[var(--color-bg)] rounded px-2 py-1.5">
              <code className="text-xs text-[var(--color-text)] whitespace-nowrap">
                $ claude mcp add &lt;name&gt; npx &lt;package&gt;
              </code>
            </div>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
