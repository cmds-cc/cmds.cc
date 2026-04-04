import "./style.css";

interface HookEntry {
  repo: string;
  name: string;
  description: string;
  author: string;
  version: string;
  hookCount: number;
  lastSeen: string;
}

async function loadHooks(): Promise<void> {
  const listEl = document.getElementById("hooks-list")!;
  const countEl = document.getElementById("hook-count")!;

  try {
    const res = await fetch("/api/hooks");
    if (!res.ok) throw new Error("Failed to fetch hooks");
    const hooks: HookEntry[] = await res.json();

    countEl.textContent = String(hooks.length);

    if (hooks.length === 0) {
      listEl.innerHTML = `<p class="text-sm text-[var(--color-text-muted)]">No hooks registered yet. Be the first!</p>`;
      return;
    }

    listEl.innerHTML = hooks
      .map(
        (hook) => `
      <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
        <div class="flex items-start justify-between gap-4 mb-2">
          <div>
            <span class="text-[var(--color-accent)] font-bold">${hook.name}</span>
            <span class="text-xs text-[var(--color-text-muted)] ml-2">v${hook.version}</span>
            <span class="text-xs text-[var(--color-text-muted)] ml-2">${hook.hookCount} hook${hook.hookCount !== 1 ? "s" : ""}</span>
          </div>
          <a href="https://github.com/${hook.repo}" class="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors shrink-0">
            ${hook.author} &rarr;
          </a>
        </div>
        <p class="text-sm text-[var(--color-text-muted)] mb-3">${hook.description}</p>
        <div class="flex items-center gap-2 bg-[var(--color-bg)] rounded px-3 py-2">
          <code class="text-xs text-[var(--color-text)] flex-1">$ npx cc-hooks-install add ${hook.repo}</code>
          <button class="copy-btn text-[var(--color-text-muted)] text-xs cursor-pointer" data-cmd="npx cc-hooks-install add ${hook.repo}" title="Copy to clipboard">
            [copy]
          </button>
        </div>
      </div>`,
      )
      .join("");

    listEl.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest(
        ".copy-btn",
      ) as HTMLElement | null;
      if (!btn) return;
      const cmd = btn.dataset.cmd!;
      navigator.clipboard.writeText(cmd).then(() => {
        btn.textContent = "[copied!]";
        setTimeout(() => (btn.textContent = "[copy]"), 2000);
      });
    });
  } catch {
    listEl.innerHTML = `<p class="text-sm text-[var(--color-text-muted)]">Failed to load hooks directory.</p>`;
  }
}

loadHooks();
