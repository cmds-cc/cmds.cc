import Layout from "../components/Layout";
import ScrambleText from "../components/ScrambleText";
import CopyButton from "../components/CopyButton";

const SKILLS = [
  {
    name: "cisco-uc-engineer",
    tag: "orchestrator",
    description:
      "Orchestrates all Cisco UC CLI tools for troubleshooting, provisioning, and monitoring",
  },
  {
    name: "cisco-axl-cli",
    description:
      "Manage CUCM via AXL — phones, lines, route patterns, SIP profiles, SQL queries",
  },
  {
    name: "cisco-ise-cli",
    description:
      "Manage Cisco ISE — endpoints, guests, network devices, RADIUS/TACACS",
  },
  {
    name: "cisco-yang-cli",
    description:
      "Manage IOS-XE devices via RESTCONF — voice troubleshooting, dial-peers, SIP trace",
  },
  {
    name: "cisco-risport-cli",
    description:
      "Query CUCM real-time device registration — phone status, SIP trunk health",
  },
  {
    name: "cisco-perfmon-cli",
    description:
      "Collect CUCM performance counters — CPU, memory, call stats, sparklines",
  },
  {
    name: "cisco-dime-cli",
    description:
      "Manage CUCM log files — selecting, downloading service logs via DIME",
  },
  {
    name: "cisco-cdr-mcp",
    description:
      "Query CUCM call detail records via MCP — CDR search, call tracing, quality stats",
  },
  {
    name: "cisco-support-cli",
    description:
      "Query Cisco Support APIs — bug search, EoL dates, PSIRT advisories, RMA tracking",
  },
  {
    name: "cisco-ucce-cli",
    description:
      "Monitor Cisco UCCE — agent states, queue stats, PG diagnostics, system health",
  },
  {
    name: "audiocodes-cli",
    description:
      "Troubleshoot VoIP on AudioCodes SBCs — call stats, alarms, SIP trace",
  },
  {
    name: "genesys-cli",
    description:
      "Query Genesys Cloud — agent states, queue stats, routing diagnostics",
  },
  {
    name: "ss-cli",
    description:
      "Manage secrets from Delinea Secret Server — credentials, env sync, password rotation",
  },
];

const INSTALL_CMD = "npx skillsadd sieteunoseis/skills.automate.builders";

export default function Skills() {
  return (
    <Layout accent="#4ade80">
      <header className="max-w-3xl mx-auto px-6 pt-20 pb-10 text-center">
        <ScrambleText
          text="skills"
          className="text-4xl sm:text-5xl font-bold leading-tight mb-8 inline-block"
        />
        <p className="text-lg text-[var(--color-text)] mb-3">
          Agent skills for Claude Code
        </p>
        <p className="text-sm text-[var(--color-text-muted)] mb-8 max-w-lg mx-auto">
          Specialized CLI tools for Cisco UC and DevOps, installable via{" "}
          <a
            href="https://skills.sh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-accent)] hover:opacity-80 transition-opacity"
          >
            skills.sh
          </a>
          .
        </p>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-3 inline-flex items-center gap-3">
          <code className="text-sm text-[var(--color-text)]">
            $ {INSTALL_CMD}
          </code>
          <CopyButton text={INSTALL_CMD} />
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="text-sm font-bold text-[var(--color-text)] mb-6">
          Skills ({SKILLS.length})
        </h2>
        <div className="space-y-3">
          {SKILLS.map((skill) => (
            <a
              key={skill.name}
              href={`https://skills.sh/s/sieteunoseis/skills.automate.builders/${skill.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-5 block hover:border-[var(--color-accent)] transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[var(--color-accent)] font-bold text-sm">
                  {skill.name}
                </span>
                {skill.tag && (
                  <span className="text-xs bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 rounded-full px-2 py-0.5">
                    {skill.tag}
                  </span>
                )}
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">
                {skill.description}
              </p>
            </a>
          ))}
        </div>
      </section>
    </Layout>
  );
}
