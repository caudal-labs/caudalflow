# Phase 1: TypeScript Agent 改写

## Goal
将 Python Agent 改写为 TypeScript，使整个项目可以部署到 Vercel。

## Success Criteria
- [ ] BFF 可以直接处理 Agent 逻辑（不再需要单独的 Python 服务）
- [ ] 前端可以通过 SSE/WebSocket 与 Agent 通信
- [ ] 保持所有现有功能（12 个前端工具、generative UI、流式响应）
- [ ] 可以部署到 Vercel

## Tasks

### Wave 1: 基础设施
- [ ] 1.1 安装 Vercel AI SDK 和相关依赖
- [ ] 1.2 创建 Agent 类型定义（消息格式、工具调用格式）
- [ ] 1.3 创建 Agent 通信层（SSE/WebSocket）

### Wave 2: Agent 核心
- [ ] 2.1 实现 Agent 系统提示词构建
- [ ] 2.2 实现 Canvas State 序列化
- [ ] 2.3 实现工具定义和调用逻辑

### Wave 3: BFF 集成
- [ ] 3.1 创建 /api/agent 端点
- [ ] 3.2 实现流式响应处理
- [ ] 3.3 实现工具调用回调

### Wave 4: 前端集成
- [ ] 4.1 创建 Agent 客户端
- [ ] 4.2 更新 CustomCopilotChat 使用新 Agent
- [ ] 4.3 移除 CopilotKit 依赖

### Wave 5: 测试和部署
- [ ] 5.1 测试所有功能
- [ ] 5.2 配置 Vercel 部署
- [ ] 5.3 更新文档

## Verification
- [ ] 副驾驶可以创建节点
- [ ] 副驾驶可以分支对话
- [ ] 副驾驶可以合并节点
- [ ] 副驾驶可以生成图表
- [ ] 所有功能在 Vercel 上正常工作
