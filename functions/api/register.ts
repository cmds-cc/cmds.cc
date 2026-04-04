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

    if (!repo || !/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repo)) {
      return new Response(JSON.stringify({ error: "Invalid repo format" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const ghUrl = `https://api.github.com/repos/${repo}/contents/claude-hooks.json`;
    const ghRes = await fetch(ghUrl, {
      headers: {
        Accept: "application/vnd.github.v3.raw",
        "User-Agent": "cc-hooks-install",
      },
    });

    if (!ghRes.ok) {
      return new Response(
        JSON.stringify({ error: "No valid claude-hooks.json found" }),
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
