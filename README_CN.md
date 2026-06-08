<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel%20AI%20SDK-4-000000?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

<p align="center">
  <a href="./README.md">English</a> | <b>中文</b>
</p>

<h1 align="center">CaudalFlow</h1>

<p align="center">
  <strong>每个想法都值得一次探索。分支、比较、合并 — 让 AI 副驾驶操控画布。</strong>
</p>

<p align="center">
  CaudalFlow 是一个可视化 AI 对话画布，让你像思维导图一样分支、探索和合并想法 — 由 LLM 驱动。可选的 AI 副驾驶可以直接在对话中创建节点、提出分支、规划合并和渲染图表。
</p>

<p align="center">
  <video src="https://github.com/user-attachments/assets/a2cc3f5d-cf6b-42e9-a4ac-3f561fe871a7" width="800" autoplay loop muted playsinline></video>
</p>

---

## 问题

线性聊天界面迫使你进入单一话题。你提问，得到答案，当你想探索一个分支时，你就失去了原来的思路。回去意味着在大量文本中滚动。比较两种方法意味着在标签页之间复制粘贴。

**对话不是线性的。你的工具也不应该是。**

## 解决方案

CaudalFlow 为你提供一个无限画布，每个对话都是一个节点。选择一段文字，分支进入更深入的探索。在两个不同的线程中看到有趣的内容？选择它们并合并 — AI 从所有父节点合成上下文，产生新的洞察。

这就是研究的实际工作方式：发散、探索、收敛。

---

## 功能特性

### AI 副驾驶

一个由 CopilotKit 驱动的侧边栏，配合 LangGraph 代理，不仅谈论你的画布 — 它还能操作它。副驾驶可以创建节点、分支对话、合并线程、高亮发现，并代表你删除节点。它实时查看完整的画布状态，在行动之前推理你的工作区。

副驾驶向代理暴露了 12 个工具：`createChatNode`、`createBranchFromNode`、`mergeChatNodes`、`appendNodeMessage`、`deleteChatNode`、`updateChatNode`、`focusChatNode`、`highlightWorkspaceFinding`，以及四个生成式 UI 渲染。

### 生成式 UI

副驾驶在聊天中渲染丰富的交互式卡片：

- **分支提案** — 代理解释为什么分支会有用，并提供建议的主题
- **合并计划** — 在合并发生之前预览哪些节点将被合并以及理由
- **节点预览** — 任何节点的摘要卡片，带有聚焦视口的按钮
- **图表** — 使用 Recharts 渲染的饼图、柱状图和折线图，由代理分析驱动

### 无限对话画布

在无限的、可平移的、可缩放的画布上创建聊天节点。每个节点都是一个完整的 AI 对话，支持流式响应、Markdown 渲染和语法高亮。

### 从任意文本分支

选择对话中的任何文字，分支进入新的探索。子节点继承父节点的完整上下文 — AI 知道讨论了什么，并在此基础上构建。

### 多节点合并

按住 **Shift + 拖动** 选择多个节点，然后用单个操作合并它们。告诉 AI *"比较这些概念"*、*"寻找联系"* 或 *"一起总结"* — 它接收每个选定对话的完整上下文，并合成统一的响应。

### 多 LLM 提供商

插入你偏好的 AI 后端：

| 提供商 | 模型 | 状态 |
|--------|------|------|
| **Anthropic** | Claude Sonnet, Opus, Haiku | 支持 |
| **OpenAI** | GPT-4o, GPT-4o-mini, o1 等 | 支持 |
| **Google Gemini** | Gemini 模型（仅代理） | 支持 |
| **Mock** | 模拟响应 | 内置（用于开发） |

添加新提供商只需四个文件，其余应用零更改 — 参见 [贡献指南](CONTRIBUTING.md)。

### 工作区

将你的探索组织到不同的工作区中。每个工作区持久化其完整状态 — 节点、边、对话、位置 — 到 localStorage。以 JSON 文件导出和导入工作区。

### 主题系统

在亮色、暗色和系统主题之间切换。主题使用 CSS 变量一致地应用于所有组件。主题偏好保存到 localStorage。

- **暗色主题** — 深色背景，高对比度
- **亮色主题** — 干净的白色背景，适合明亮环境
- **系统** — 自动跟随操作系统的主题设置

### 国际化 (i18n)

完整支持英语和中文。所有 UI 文本、工具提示和消息都已国际化。语言偏好保存到 localStorage。

### 节点交互

| 操作 | 方式 |
|------|------|
| 新建节点 | 双击画布或 `+` 按钮 |
| 平移画布 | 按住 **空格** + 拖动 |
| 选择节点 | 点击节点 |
| 多选节点 | **Shift** + 拖动 |
| 从文本分支 | 选择文本，点击 **分支** 按钮 |
| 删除节点 | 按 **Delete**/**X** 键或点击 **X** 按钮（带确认） |
| 折叠节点 | 点击标题栏中的折叠按钮 |
| 最大化节点 | 点击标题栏中的最大化按钮 |
| 连接节点 | 从节点连接点拖动到另一个节点 |
| 创建连接节点 | 从节点连接点拖动到空白区域 |

### 工具提示

所有工具栏按钮都有描述性工具提示，悬停时显示，帮助你理解每个功能。

---

## 快速开始

### 方式一：Vercel（推荐）

1. Fork 仓库
2. 导入到 Vercel
3. 部署

### 方式二：本地开发

```bash
git clone https://github.com/yancongya/caudalflow.git
cd caudalflow
npm install
```

启动开发服务器：

```bash
npm run dev
```

打开 **http://localhost:5173** — 应用已就绪。

### 方式三：完整栈（带 BFF）

```bash
npm run dev:ui          # 仅前端
npm run dev:bff         # BFF 服务器（端口 4000）
```

在设置面板中配置 API Key — 无需环境变量！

> **你的密钥留在你的机器上。** API 密钥存储在浏览器 localStorage 中，直接发送给提供商。

---

## 工作原理

### 画布

基于 [@xyflow/react](https://reactflow.dev/) 构建，每个对话都是无限画布上可拖动、可调整大小的节点。边连接父节点和子节点，并标注分支上下文。

### 分支

当你在对话中选择文本并点击 **分支** 时，CaudalFlow：

1. 在父节点右侧创建新的子节点
2. 用带标签的边连接它们
3. 构建包含父对话摘要的系统提示
4. 自动发送你的提示并流式传输 AI 的响应

子节点"知道"父节点讨论了什么 — 后续消息会继续使用该上下文。

### 合并

当你 Shift 拖动选择 2+ 个节点并提交操作时：

1. 创建新的合并节点，位于所有父节点右侧
2. 边将每个父节点连接到合并节点
3. 系统提示包含来自每个父对话的**完整问答摘要**
4. AI 根据你的操作跨所有上下文进行合成

这是杀手级功能 — 它让你运行并行研究线程，然后将它们收敛成一个统一的、有见地的分析。

### AI 副驾驶

副驾驶侧边栏通过 Hono BFF 将前端连接到 LangGraph Python 代理：

1. **状态同步** — 前端订阅 `flowStore`、`chatStore` 和 `workspaceStore`，并在每次更改时向代理推送快照（80ms 防抖，通过 JSON 序列化去重）
2. **工具调用** — 代理调用前端工具（`createChatNode`、`mergeChatNodes` 等），直接修改 Zustand stores
3. **生成式 UI** — 四个渲染工具返回 React 组件（分支提案、合并计划、节点预览、图表），出现在副驾驶聊天中

代理可以看到：活动工作区、所有节点和边、对话（带消息限制以适应上下文窗口）、选定节点、合并上下文和当前 LLM 配置。

### 状态管理

四个 Zustand stores 保持整洁：

| Store | 职责 |
|-------|------|
| `flowStore` | 节点、边、图操作 |
| `chatStore` | 每个节点的消息、流式状态 |
| `settingsStore` | LLM 配置、UI 偏好、主题、语言 |
| `workspaceStore` | 多工作区管理 |

所有内容都通过防抖自动保存持久化到 localStorage。

---

## 架构

```
┌──────────────────────────────────────────────────────┐
│                     前端                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ ChatNode │──│ ChatNode │──│ ChatNode │           │
│  │ (父节点) │  │ (分支)   │  │ (合并)   │           │
│  └──────────┘  └──────────┘  └──────────┘           │
│                                                      │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐          │
│  │ flowStore │ │ chatStore │ │ settings  │          │
│  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘          │
│        └──────────────┼─────────────┘                │
│                       ▼                              │
│         ┌──────────────────────┐                     │
│         │  CopilotKit Bridge   │ ← 12 个前端工具     │
│         │  (状态同步 80ms)     │ ← 生成式 UI         │
│         └──────────┬───────────┘                     │
│                    │                                 │
│  ┌─────────────────┼──────────────────┐              │
│  │     LLM 服务层（直接）              │              │
│  │  ┌──────────┬──────────┬────────┐  │              │
│  │  │Anthropic │  OpenAI  │  Mock  │  │              │
│  │  └──────────┴──────────┴────────┘  │              │
│  └────────────────────────────────────┘              │
└──────────────────────┬───────────────────────────────┘
                       │ /api/copilotkit
                       ▼
            ┌─────────────────────┐
            │    BFF (Hono)       │
            │  CopilotKit 运行时  │
            │  + LLM 代理        │
            └──────────┬──────────┘
                       │
                       ▼
            ┌─────────────────────┐
            │  LangGraph 代理     │
            │  (Python)           │
            │  ┌───────┬────────┐ │
            │  │Claude │ GPT-4o │ │
            │  │Gemini │  ...   │ │
            │  └───────┴────────┘ │
            └─────────────────────┘
```

画布可以在浏览器中独立运行（直接 LLM 调用，无需后端）。BFF 和代理是可选的 — 它们驱动副驾驶侧边栏。

### 提供商系统

每个 LLM 提供商实现单一接口：

```typescript
interface LLMProvider {
  id: string;
  name: string;
  streamChat(messages, config, callbacks, signal): void;
}
```

提供商在启动时注册，在运行时选择。应用的其余部分完全与提供商无关 — 分支、合并、上下文构建和流式传输在无论使用哪个 AI 的情况下都完全相同。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript 5.9 |
| 构建 | Vite 8 |
| 样式 | Tailwind CSS 4 |
| 画布 | @xyflow/react 12 |
| 状态 | Zustand 5 |
| AI | Vercel AI SDK |
| LLM 提供商 | Anthropic, OpenAI, 自定义（OpenAI 兼容） |
| 国际化 | react-i18next |
| 图表 | Recharts 3 |
| BFF | Hono 4 |
| Markdown | react-markdown + remark-gfm |
| 代码高亮 | react-syntax-highlighter (Prism) |
| 图标 | Lucide React |
| ID | nanoid |

可在浏览器中运行 — 或使用完整的副驾驶栈。

---

## 开发

```bash
# 仅画布
npm run dev            # 带 HMR 的开发服务器
npm run build          # 类型检查 + 生产构建
npm run lint           # ESLint
npm test               # 运行单元测试
npm run test:watch     # 监视模式下的测试
npm run preview        # 预览生产构建

# 副驾驶栈
npm run dev:copilot    # 同时启动前端 + BFF + 代理
npm run dev:ui         # 仅前端（dev 的别名）
npm run dev:bff        # BFF 服务器（Hono，端口 4000）
npm run dev:agent      # LangGraph 代理（端口 8133）
npm run install:agent  # 创建 Python 虚拟环境 + 安装代理依赖
```

### 项目结构

```
src/
├── components/
│   ├── canvas/        # Canvas, CanvasControls, MergeSelectionPopup
│   ├── copilot/       # CopilotKitProviderShell, CanvasCopilotBridge,
│   │                  # BranchProposalCard, ChartRenderer, canvasAgentState
│   ├── nodes/         # ChatNode, ChatMessage, ChatInput, SelectionPopup
│   ├── edges/         # TopicEdge（自定义边渲染器）
│   └── ui/            # SettingsPanel, HelpGuide, WorkspaceSelector
├── hooks/             # useChatNode（核心聊天逻辑）, usePersistence
├── i18n/              # 国际化（en.json, zh.json）
├── stores/            # flowStore, chatStore, settingsStore, workspaceStore
├── services/
│   ├── llm.ts         # 流式编排器
│   └── providers/     # LLM 提供商：mock, openai, anthropic
├── types/             # chat.ts, flow.ts, workspace.ts
└── utils/             # systemPrompts.ts, nodeLayout.ts

apps/
├── agent/             # Python LangGraph 代理（多 LLM，CopilotKit SDK）
├── bff/               # Hono BFF — CopilotKit 运行时 + LLM 代理
└── mcp/               # 预留 MCP 集成
```

### 添加提供商

参见 [CONTRIBUTING.md 中的分步指南](CONTRIBUTING.md#添加新的-llm-提供商)。只需四个文件：

1. 提供商实现（`services/providers/yourprovider.ts`）
2. 注册它（`services/providers/registry.ts`）
3. 设置 UI 部分（`components/ui/SettingsPanel.tsx`）
4. 默认配置（`stores/settingsStore.ts`）

---

## 更新日志

### v2.1.0（最新）

- **主题系统** — 支持亮色、暗色和系统主题，使用 CSS 变量
- **国际化** — 完整的中英文语言支持
- **自定义聊天面板** — 替换 CopilotKit 侧边栏为自定义暗色主题聊天组件
- **改进的交互** — 空格键平移，Delete/X 键删除（带确认）
- **节点折叠** — 折叠的节点显示为小卡片，点击展开
- **连接创建** — 从节点连接点拖动到空白区域创建连接节点
- **工具提示** — 所有工具栏按钮都有描述性悬停提示

### v2.0.0

- 与 CopilotKit 集成的重大重写
- LangGraph 代理支持
- 生成式 UI（分支提案、合并计划、图表）
- 多工作区支持

---

## 部署

### Vercel（推荐）

1. Fork 仓库
2. 前往 [vercel.com/new](https://vercel.com/new)
3. 导入你的 fork
4. 部署

无需环境变量 — API 密钥在应用设置中配置。

### 其他平台

应用可以部署到任何 Node.js 平台：

- Railway
- Fly.io
- Render
- AWS Lambda
- Cloudflare Workers

---

## 贡献

欢迎贡献！参见 [CONTRIBUTING.md](CONTRIBUTING.md) 了解：

- 开发设置
- 项目结构导览
- 架构决策
- 代码风格指南
- PR 流程

## 许可证

[MIT](LICENSE) — 使用它、Fork 它、在它基础上构建。

---

<p align="center">
  由 <a href="https://github.com/caudal-labs">Caudal Labs</a> 构建 | Fork by <a href="https://github.com/yancongya">yancongya</a>
</p>
