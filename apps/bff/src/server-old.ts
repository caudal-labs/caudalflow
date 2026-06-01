import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { CopilotRuntime, createCopilotEndpoint } from '@copilotkit/runtime/v2';
import { LangGraphAgent } from '@copilotkit/runtime/langgraph';

const agent = new LangGraphAgent({
  deploymentUrl: process.env.LANGGRAPH_DEPLOYMENT_URL ?? 'http://localhost:8133',
  graphId: process.env.LANGGRAPH_GRAPH_ID ?? 'default',
  langsmithApiKey: process.env.LANGSMITH_API_KEY || undefined,
  assistantConfig: {
    recursion_limit: Number(process.env.LANGGRAPH_RECURSION_LIMIT ?? 80),
  },
});

const copilotApp = createCopilotEndpoint({
  basePath: '/api/copilotkit',
  runtime: new CopilotRuntime({
    agents: { default: agent },
    identifyUser: () => ({
      id: process.env.COPILOT_USER_ID ?? 'local-user',
      name: process.env.COPILOT_USER_NAME ?? 'CaudalFlow User',
    }),
    licenseToken: process.env.COPILOTKIT_LICENSE_TOKEN,
    openGenerativeUI: true,
    a2ui: { injectA2UITool: true },
  }),
});

const app = new Hono();

app.use(
  '*',
  cors({
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
    allowHeaders: ['Content-Type', 'Authorization', 'x-llm-provider'],
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);

const providerConfig: Record<string, { url: string; authHeader: (key: string) => Record<string, string>; envKey: string }> = {
  anthropic: {
    url: 'https://api.anthropic.com/v1/messages',
    authHeader: (key) => ({ 'x-api-key': key, 'anthropic-version': '2023-06-01' }),
    envKey: 'ANTHROPIC_API_KEY',
  },
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    authHeader: (key) => ({ Authorization: `Bearer ${key}` }),
    envKey: 'OPENAI_API_KEY',
  },
};

app.post('/api/llm', async (c) => {
  const provider = c.req.header('x-llm-provider');
  const cfg = provider ? providerConfig[provider] : undefined;

  if (!provider || !cfg) {
    return c.json({ error: `Unknown provider: ${provider ?? 'none'}` }, 400);
  }

  const apiKey = process.env[cfg.envKey];
  if (!apiKey) {
    return c.json({ error: `Missing env var ${cfg.envKey}` }, 502);
  }

  const upstream = await fetch(cfg.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...cfg.authHeader(apiKey),
    },
    body: c.req.raw.body,
    // @ts-expect-error -- Node fetch supports duplex for streaming request bodies
    duplex: 'half',
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'text/event-stream',
    },
  });
});

app.route('/', copilotApp);

const port = Number(process.env.PORT ?? 4000);

serve({ fetch: app.fetch, port }, () => {
  console.log(`CopilotKit BFF ready at http://localhost:${port}/api/copilotkit`);
  console.log(`LLM proxy ready at http://localhost:${port}/api/llm`);
});
