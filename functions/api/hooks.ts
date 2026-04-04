interface Env {
  CC_HOOKS_REGISTRY: KVNamespace;
}

interface HookEntry {
  repo: string;
  name: string;
  description: string;
  author: string;
  version: string;
  hookCount: number;
  lastSeen: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=60",
  };

  try {
    const list = await context.env.CC_HOOKS_REGISTRY.list({ prefix: "repo:" });
    const entries: HookEntry[] = [];

    for (const key of list.keys) {
      const val = await context.env.CC_HOOKS_REGISTRY.get(key.name);
      if (val) {
        entries.push(JSON.parse(val) as HookEntry);
      }
    }

    entries.sort(
      (a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime(),
    );

    return new Response(JSON.stringify(entries), {
      status: 200,
      headers: corsHeaders,
    });
  } catch {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: corsHeaders,
    });
  }
};
