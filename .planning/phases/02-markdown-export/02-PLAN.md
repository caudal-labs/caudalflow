# Markdown 导出功能计划

## 需求
1. 支持导出选中的单个或多个节点
2. 导出为 Markdown 文档
3. 正确处理节点之间的层级关系（父子关系）

## 数据结构分析

### 节点结构
- `id`: 节点唯一标识
- `data.topic`: 节点主题/标题
- `data.parentNodeId`: 父节点ID（分支场景）
- `data.parentNodeIds`: 多个父节点ID（合并场景）
- `data.branchText`: 分支时选中的文本

### 消息结构
- `role`: 'user' | 'assistant' | 'system'
- `content`: 消息内容
- `timestamp`: 时间戳

### 边结构
- `source`: 源节点ID
- `target`: 目标节点ID
- `data.label`: 边标签

## Markdown 结构设计

```markdown
# Workspace Name

## Node Topic 1
> Branch from: Parent Node

### Conversation

**User:** 用户消息

**Assistant:** AI 回复

---

## Node Topic 2 (子节点)
> Branch from: Node Topic 1

### Conversation
...
```

## 实现步骤

1. 创建 `exportMarkdown` 工具函数
2. 在顶部导航栏添加"导出 Markdown"按钮
3. 支持导出选中节点或全部节点
4. 处理节点层级关系
5. 生成格式化的 Markdown 文件
