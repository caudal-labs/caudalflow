<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/LangGraph-0.2+-1C3C3C?style=flat-square&logo=langchain&logoColor=white" />
  <img src="https://img.shields.io/badge/CopilotKit-1.57+-000000?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

<h1 align="center">CaudalFlow</h1>

<p align="center">
  <strong>Every idea deserves a side quest. Branch, compare, merge — with an AI copilot that operates the canvas.</strong>
</p>

<p align="center">
  CaudalFlow is a visual canvas for AI conversations that lets you branch, explore, and merge ideas like a mind map — powered by LLMs. An optional AI copilot can create nodes, propose branches, plan merges, and render charts directly in the conversation.
</p>

<p align="center">
  <video src="https://github.com/user-attachments/assets/a2cc3f5d-cf6b-42e9-a4ac-3f561fe871a7" width="800" autoplay loop muted playsinline></video>
</p>

---

## The Problem

Linear chat interfaces force you into a single thread. You ask a question, get an answer, and when you want to explore a tangent, you lose your original train of thought. Going back means scrolling through walls of text. Comparing two approaches means copy-pasting between tabs.

**Conversations aren't linear. Your tools shouldn't be either.**

## The Solution

CaudalFlow gives you an infinite canvas where every conversation is a node. Select a piece of text, branch into a deeper exploration. See something interesting in two different threads? Select them both and merge — the AI synthesizes context from all parents into a new insight.

It's how research actually works: diverge, explore, converge.

---

## Features

### AI Copilot

A CopilotKit-powered sidebar with a LangGraph agent that doesn't just talk about your canvas — it operates it. The copilot can create nodes, branch conversations, merge threads, highlight findings, and delete nodes on your behalf. It sees the full canvas state in real time and reasons about your workspace before acting.

The copilot exposes 12 tools to the agent: `createChatNode`, `createBranchFromNode`, `mergeChatNodes`, `appendNodeMessage`, `deleteChatNode`, `updateChatNode`, `focusChatNode`, `highlightWorkspaceFinding`, and four generative UI renders.

### Generative UI

The copilot renders rich, interactive cards inline in the chat:

- **Branch proposals** — the agent explains why a branch would be useful, with suggested topics
- **Merge plans** — a preview of which nodes will be merged and the rationale, before the merge happens
- **Node previews** — a summary card for any node, with a button to focus the viewport on it
- **Charts** — pie, bar, and line charts rendered with Recharts, driven by the agent's analysis

### Infinite Conversation Canvas

Create chat nodes anywhere on an infinite, pannable, zoomable canvas. Each node is a full AI conversation with streaming responses, markdown rendering, and syntax highlighting.

### Branch from Any Text

Select any text in a conversation and branch into a new exploration. The child node inherits the parent's full context — the AI knows what was discussed and builds on it.

### Multi-Node Merge

Hold **Shift + drag** to select multiple nodes, then merge them with a single action. Tell the AI to *"compare these concepts"*, *"find connections"*, or *"summarize together"* — it receives the full context from every selected conversation and synthesizes a unified response.

### Multiple LLM Providers

Plug in your preferred AI backend:

| Provider | Models | Status |
|----------|--------|--------|
| **Anthropic** | Claude Sonnet, Opus, Haiku | Supported |
| **OpenAI** | GPT-4o, GPT-4o-mini, o1, etc. | Supported |
| **Google Gemini** | Gemini models (agent only) | Supported |
| **Mock** | Simulated responses | Built-in (for development) |

Adding a new provider is four files and zero changes to the rest of the app — see the [Contributing Guide](CONTRIBUTING.md).

### Workspaces

Organize your explorations into separate workspaces. Each workspace persists its full state — nodes, edges, conversations, positions — to localStorage. Export and import workspaces as JSON files.

### Keyboard-Driven Workflow

| Action | How |
|--------|-----|
| New node | Double-click canvas or `+` button |
| Pan canvas | Click & drag |
| Branch from text | Select text, click **Branch** button |
| Multi-select nodes | **Shift** + drag |
| Merge selected nodes | Type action in merge popup |
| Dismiss popups | **Esc** |
| Maximize node | Click maximize in header |

---

## Quick Start

### Run instantly with npx

```bash
npx caudalflow
```

That's it — opens in your browser, runs entirely on your machine. Works out of the box with the mock provider; plug in an API key in Settings for real LLM responses.

### With AI Copilot

To run the full stack (frontend + BFF + LangGraph agent):

```bash
git clone https://github.com/caudal-labs/caudalflow.git
cd caudalflow
npm install
npm run install:agent   # creates Python venv, installs agent deps
```

Create `apps/agent/.env` with at least one LLM key:

```env
ANTHROPIC_API_KEY=sk-ant-...
# and/or
OPENAI_API_KEY=sk-...
# and/or
GOOGLE_API_KEY=...
```

Then launch everything with a single command:

```bash
npm run dev:copilot
```

This starts the Vite dev server, the Hono BFF, and the LangGraph agent concurrently. Open **http://localhost:5173** and click the copilot sidebar to start.

### Development Setup (canvas only)

**Prerequisites:** Node.js 20+, an API key from [Anthropic](https://console.anthropic.com/) or [OpenAI](https://platform.openai.com/) (optional — mock mode works out of the box)

```bash
git clone https://github.com/caudal-labs/caudalflow.git
cd caudalflow
npm install
npm run dev
```

Open **http://localhost:5173** — you're in. The mock provider is active by default, so you can explore the full UI immediately.

### Connect an LLM

1. Click the **Settings** gear icon (left toolbar)
2. Select **Anthropic** or **OpenAI** from the provider dropdown
3. Paste your API key
4. Start chatting — responses stream in real-time

> **Your keys stay on your machine.** In browser-only mode, API keys are stored in localStorage and sent directly to the provider. With the copilot stack, keys live in your local `.env` and go through your local BFF — never a third-party server.

---

## How It Works

### The Canvas

Built on [@xyflow/react](https://reactflow.dev/), every conversation is a draggable, resizable node on an infinite canvas. Edges connect parent and child nodes, labeled with the branching context.

### Branching

When you select text in a conversation and click **Branch**, CaudalFlow:

1. Creates a new child node to the right of the parent
2. Connects them with a labeled edge
3. Builds a system prompt that includes the parent's conversation summary
4. Auto-sends your prompt and streams the AI's response

The child node "knows" what the parent discussed — follow-up messages continue with that context.

### Merging

When you Shift-drag to select 2+ nodes and submit an action:

1. A new merge node is created, positioned to the right of all parents
2. Edges connect every parent to the merge node
3. The system prompt includes a **full Q&A digest** from each parent conversation
4. The AI synthesizes across all contexts based on your action

This is the killer feature — it lets you run parallel research threads and then converge them into a single, informed analysis.

### AI Copilot

The copilot sidebar connects the frontend to a LangGraph Python agent through a Hono BFF:

1. **State sync** — the frontend subscribes to `flowStore`, `chatStore`, and `workspaceStore` and pushes a snapshot to the agent on every change (debounced 80 ms, deduplicated by JSON serialization)
2. **Tool calls** — the agent calls frontend tools (`createChatNode`, `mergeChatNodes`, etc.) that directly mutate the Zustand stores
3. **Generative UI** — four render tools return React components (branch proposals, merge plans, node previews, charts) that appear inline in the copilot chat

The agent sees: active workspace, all nodes and edges, conversations (with message limits to fit context windows), selected nodes, merge context, and current LLM config.

### State Management

Four Zustand stores keep things clean:

| Store | Responsibility |
|-------|---------------|
| `flowStore` | Nodes, edges, graph mutations |
| `chatStore` | Messages per node, streaming state |
| `settingsStore` | LLM config, UI preferences |
| `workspaceStore` | Multi-workspace management |

Everything persists to localStorage with debounced auto-save.

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                     Frontend                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ ChatNode │──│ ChatNode │──│ ChatNode │           │
│  │ (parent) │  │ (branch) │  │ (merge)  │           │
│  └──────────┘  └──────────┘  └──────────┘           │
│                                                      │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐          │
│  │ flowStore │ │ chatStore │ │ settings  │          │
│  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘          │
│        └──────────────┼─────────────┘                │
│                       ▼                              │
│         ┌──────────────────────┐                     │
│         │  CopilotKit Bridge   │ ← 12 frontend tools │
│         │  (state sync 80 ms)  │ ← generative UI     │
│         └──────────┬───────────┘                     │
│                    │                                 │
│  ┌─────────────────┼──────────────────┐              │
│  │     LLM Service Layer (direct)     │              │
│  │  ┌──────────┬──────────┬────────┐  │              │
│  │  │Anthropic │  OpenAI  │  Mock  │  │              │
│  │  └──────────┴──────────┴────────┘  │              │
│  └────────────────────────────────────┘              │
└──────────────────────┬───────────────────────────────┘
                       │ /api/copilotkit
                       ▼
            ┌─────────────────────┐
            │    BFF (Hono)       │
            │  CopilotKit Runtime │
            │  + LLM proxy        │
            └──────────┬──────────┘
                       │
                       ▼
            ┌─────────────────────┐
            │  LangGraph Agent    │
            │  (Python)           │
            │  ┌───────┬────────┐ │
            │  │Claude │ GPT-4o │ │
            │  │Gemini │  ...   │ │
            │  └───────┴────────┘ │
            └─────────────────────┘
```

The canvas works standalone in the browser (direct LLM calls, no backend needed). The BFF and agent are optional — they power the copilot sidebar.

### Provider System

Every LLM provider implements a single interface:

```typescript
interface LLMProvider {
  id: string;
  name: string;
  streamChat(messages, config, callbacks, signal): void;
}
```

Providers are registered at startup and selected at runtime. The rest of the app is completely provider-agnostic — branching, merging, context building, and streaming all work identically regardless of which AI is behind it.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 |
| Canvas | @xyflow/react 12 |
| State | Zustand 5 |
| Copilot | CopilotKit 1.57 |
| Charts | Recharts 3 |
| BFF | Hono 4 |
| Agent | Python 3.11+, LangGraph, LangChain |
| Markdown | react-markdown + remark-gfm |
| Code Highlighting | react-syntax-highlighter (Prism) |
| Icons | Lucide React |
| IDs | nanoid |

Runs in the browser — or with the full copilot stack.

---

## Development

```bash
# Canvas only
npm run dev            # Dev server with HMR
npm run build          # Type-check + production build
npm run lint           # ESLint
npm test               # Run unit tests
npm run test:watch     # Tests in watch mode
npm run preview        # Preview production build

# Copilot stack
npm run dev:copilot    # Launch frontend + BFF + agent concurrently
npm run dev:ui         # Frontend only (alias for dev)
npm run dev:bff        # BFF server (Hono, port 4000)
npm run dev:agent      # LangGraph agent (port 8133)
npm run install:agent  # Create Python venv + install agent deps
```

### Project Structure

```
src/
├── components/
│   ├── canvas/        # Canvas, CanvasControls, MergeSelectionPopup
│   ├── copilot/       # CopilotKitProviderShell, CanvasCopilotBridge,
│   │                  # BranchProposalCard, ChartRenderer, canvasAgentState
│   ├── nodes/         # ChatNode, ChatMessage, ChatInput, SelectionPopup
│   ├── edges/         # TopicEdge (custom edge renderer)
│   └── ui/            # SettingsPanel, HelpGuide, WorkspaceSelector
├── hooks/             # useChatNode (core chat logic), usePersistence
├── stores/            # flowStore, chatStore, settingsStore, workspaceStore
├── services/
│   ├── llm.ts         # Streaming orchestrator
│   └── providers/     # LLM providers: mock, openai, anthropic
├── types/             # chat.ts, flow.ts, workspace.ts
└── utils/             # systemPrompts.ts, nodeLayout.ts

apps/
├── agent/             # Python LangGraph agent (multi-LLM, CopilotKit SDK)
├── bff/               # Hono BFF — CopilotKit Runtime + LLM proxy
└── mcp/               # Reserved for MCP integration
```

### Adding a Provider

See the [step-by-step guide in CONTRIBUTING.md](CONTRIBUTING.md#adding-a-new-llm-provider). It's four files:

1. Provider implementation (`services/providers/yourprovider.ts`)
2. Register it (`services/providers/registry.ts`)
3. Settings UI section (`components/ui/SettingsPanel.tsx`)
4. Default config (`stores/settingsStore.ts`)

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Development setup
- Project structure walkthrough
- Architecture decisions
- Code style guide
- PR process

## License

[MIT](LICENSE) — use it, fork it, build on it.

---

<p align="center">
  Built by <a href="https://github.com/caudal-labs">Caudal Labs</a>
</p>
