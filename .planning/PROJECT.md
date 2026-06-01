# CaudalFlow Project

## Vision
将 CaudalFlow 的 Python Agent 改写为 TypeScript，使整个项目可以部署到 Vercel 或其他 Node.js 平台。

## Current State
- 前端：React 19 + Vite 8 + Tailwind CSS 4
- BFF：Hono 服务器（TypeScript）
- Agent：Python LangGraph（需要改写）

## Goal
将 Agent 改写为 TypeScript，使用 Vercel AI SDK，使整个项目可以：
1. 部署到 Vercel
2. 部署到任何 Node.js 平台
3. 简化部署流程

## Constraints
- 保持现有功能不变
- 支持流式响应
- 支持多 LLM 提供商
