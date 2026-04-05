import Layout from "../components/Layout";
import ScrambleText from "../components/ScrambleText";
import CopyButton from "../components/CopyButton";

const SERVERS = [
  {
    name: "mcp-cisco-support",
    description:
      "Cisco Support APIs — bug search, case management, EoL, PSIRT advisories, product info, software suggestions, serial lookups, and RMA tracking. 46 tools across 8 APIs.",
    transport: "stdio",
    install: "npx mcp-cisco-support",
    claudeInstall:
      "claude mcp add --transport stdio cisco-support npx mcp-cisco-support",
    features: [
      "8 Cisco Support APIs (46 tools)",
      "OAuth 2.1, Bearer token, or stdio auth",
      "Configurable API access via SUPPORT_API env",
      "Docker support",
    ],
    repo: "sieteunoseis/mcp-cisco-support",
    npm: "mcp-cisco-support",
  },
];

export default function Mcp() {
  return (
    <Layout accent="#c084fc">
      <header className="max-w-3xl mx-auto px-6 pt-20 pb-10 text-center">
        <ScrambleText
          text="mcp"
          className="text-4xl sm:text-5xl font-bold leading-tight mb-8 inline-block"
        />
        <p className="text-lg text-[var(--color-text)] mb-3">
          MCP servers for Claude Code
        </p>
        <p className="text-sm text-[var(--color-text-muted)] mb-8 max-w-lg mx-auto">
          Model Context Protocol servers for Cisco infrastructure. Connect
          Claude directly to your support APIs and call data.
        </p>
      </header>

      <section className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="text-sm font-bold text-[var(--color-text)] mb-6">
          Servers
        </h2>
        <div className="space-y-4">
          {SERVERS.map((server) => (
            <div
              key={server.name}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-[var(--color-accent)] font-bold text-sm">
                    {server.name}
                  </span>
                  <span className="text-xs bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 rounded-full px-2 py-0.5">
                    {server.transport}
                  </span>
                </div>
                <a
                  href={`https://github.com/${server.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors shrink-0"
                >
                  GitHub &rarr;
                </a>
              </div>

              <p className="text-sm text-[var(--color-text-muted)] mb-4">
                {server.description}
              </p>

              <ul className="text-xs text-[var(--color-text-muted)] mb-4 space-y-1">
                {server.features.map((f) => (
                  <li key={f}>
                    <span className="text-[var(--color-accent)]">•</span> {f}
                  </li>
                ))}
              </ul>

              <div className="space-y-2">
                {server.install && (
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">
                      Run directly:
                    </p>
                    <div className="bg-[var(--color-bg)] rounded px-3 py-2 flex items-center gap-2">
                      <code className="text-xs text-[var(--color-text)] flex-1 whitespace-nowrap">
                        $ {server.install}
                      </code>
                      <CopyButton text={server.install} />
                    </div>
                  </div>
                )}
                {server.claudeInstall && (
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">
                      Add to Claude Code:
                    </p>
                    <div className="bg-[var(--color-bg)] rounded px-3 py-2 flex items-center gap-2">
                      <code className="text-xs text-[var(--color-text)] flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                        $ {server.claudeInstall}
                      </code>
                      <CopyButton text={server.claudeInstall} />
                    </div>
                  </div>
                )}
              </div>
              {server.npm && (
                <a
                  href={`https://www.npmjs.com/package/${server.npm}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                >
                  npm &rarr;
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
