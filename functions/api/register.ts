interface Env {
  CC_HOOKS_REGISTRY: KVNamespace;
}

interface RegisterBody {
  repo: string;
}

interface HookManifest {
  name: string;
  description: string;
  author: string;
  version: string;
  hooks: unknown[];
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    const body = (await context.request.json()) as RegisterBody;
    const repo = body.repo;

    if (
      !repo ||
      !/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(\/[a-zA-Z0-9_.-]+)*$/.test(repo)
    ) {
      return new Response(JSON.stringify({ error: "Invalid repo format" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Use raw.githubusercontent.com to avoid GitHub API rate limits
    // Supports owner/repo and owner/repo/subpath formats
    const parts = repo.split("/");
    const owner = parts[0];
    const name = parts[1];
    const subpath = parts.slice(2).join("/");
    const filePath = subpath
      ? `${subpath}/claude-hooks.json`
      : "claude-hooks.json";
    const ghUrl = `https://raw.githubusercontent.com/${owner}/${name}/HEAD/${filePath}`;
    const ghRes = await fetch(ghUrl, {
      headers: { "User-Agent": "cmds-cc-hooks" },
    });

    if (!ghRes.ok) {
      return new Response(
        JSON.stringify({
          error: "No valid claude-hooks.json found",
          status: ghRes.status,
        }),
        { status: 400, headers: corsHeaders },
      );
    }

    const manifest = (await ghRes.json()) as HookManifest;

    if (!manifest.name || !Array.isArray(manifest.hooks)) {
      return new Response(
        JSON.stringify({ error: "Invalid claude-hooks.json" }),
        { status: 400, headers: corsHeaders },
      );
    }

    const entry = {
      repo,
      name: manifest.name,
      description: manifest.description || "",
      author: manifest.author || repo.split("/")[0],
      version: manifest.version || "0.0.0",
      hookCount: manifest.hooks.length,
      lastSeen: new Date().toISOString(),
    };

    await context.env.CC_HOOKS_REGISTRY.put(
      `repo:${repo}`,
      JSON.stringify(entry),
    );

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch {
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
