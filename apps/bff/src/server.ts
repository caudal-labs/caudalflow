import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const app = new Hono();

app.use(
  '*',
  cors({
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
    allowHeaders: ['Content-Type', 'Authorization', 'x-llm-provider', 'x-api-key'],
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);

// LLM provider configs
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

// LLM proxy endpoint (for direct node chat)
app.post('/api/llm', async (c) => {
  const provider = c.req.header('x-llm-provider');
  const cfg = provider ? providerConfig[provider] : undefined;

  if (!provider || !cfg) {
    return c.json({ error: `Unknown provider: ${provider ?? 'none'}` }, 400);
  }

  // Use API key from request header first, fallback to env var
  const requestApiKey = c.req.header('x-api-key');
  const apiKey = requestApiKey || process.env[cfg.envKey];
  if (!apiKey) {
    return c.json({ error: `Missing API key. Configure it in Settings or set ${cfg.envKey} environment variable.` }, 502);
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

// Agent endpoint
app.post('/api/agent', async (c) => {
  const { message, canvasState, threadId } = await c.req.json();

  const runtime = process.env.AGENT_RUNTIME ?? 'anthropic';
  
  let apiKey: string | undefined;
  let model: any;

  switch (runtime) {
    case 'anthropic':
      apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) return c.json({ error: 'Missing ANTHROPIC_API_KEY' }, 500);
      const anthropic = createAnthropic({ apiKey });
      model = anthropic('claude-sonnet-4-20250514');
      break;
    case 'openai':
      apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) return c.json({ error: 'Missing OPENAI_API_KEY' }, 500);
      const openai = createOpenAI({ apiKey });
      model = openai('gpt-4o-mini');
      break;
    case 'gemini':
      apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return c.json({ error: 'Missing GEMINI_API_KEY' }, 500);
      const google = createGoogleGenerativeAI({ apiKey });
      model = google('gemini-2.0-flash');
      break;
    default:
      return c.json({ error: `Unknown runtime: ${runtime}` }, 400);
  }

  // Build system prompt with canvas state
  const nodeCount = canvasState.nodes?.length ?? 0;
  const edgeCount = canvasState.edges?.length ?? 0;
  
  const systemPrompt = `You are CaudalFlow AI Assistant, helping users manage their conversation canvas.

Current canvas state:
- ${nodeCount} nodes
- ${edgeCount} edges

You can help users by:
1. Creating new chat nodes
2. Branching from existing nodes
3. Merging multiple nodes
4. Deleting nodes
5. Updating node properties
6. Focusing on specific nodes
7. Rendering charts and visualizations
8. Proposing branches and merge plans

When the user asks you to do something with the canvas, explain what you would do.`;

  // Stream response
  const result = streamText({
    model,
    system: systemPrompt,
    messages: [{ role: 'user', content: message }],
  });

  // Return streaming response
  return new Response(result.textStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
});

const port = Number(process.env.PORT ?? 4000);

serve({ fetch: app.fetch, port }, () => {
  console.log(`BFF ready at http://localhost:${port}`);
  console.log(`LLM proxy: http://localhost:${port}/api/llm`);
  console.log(`Agent: http://localhost:${port}/api/agent`);
});
