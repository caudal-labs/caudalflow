/* CaudalFlow landing v2 — "Play the Canvas" engine.
   Modules: i18n · theme · mini-markdown · playground (nodes/edges/drag/zoom/
   branch/merge/streaming/mission) · reveals · terminal · copy · magnetic. */

(() => {
  'use strict';

  const REPO = 'https://github.com/caudal-labs/caudalflow';
  const CLONE = 'git clone https://github.com/caudal-labs/caudalflow.git';

  /* ————————————————— i18n ————————————————— */

  const dict = {
    en: {
      'nav.github': 'GitHub',
      'hero.eyebrow': 'Open source · Visual AI canvas',
      'hero.title': 'Every idea deserves a side quest.',
      'hero.sub': 'Branch any conversation, explore in parallel, merge the insights back — on an infinite canvas with an AI copilot that can operate it. The canvas below is real: go ahead, play it.',
      'hero.ctaPrimary': 'Open GitHub',
      'hero.ctaSecondary': 'Try the live canvas',
      'nav.lang': 'Switch language',
      'nav.theme': 'Toggle theme',
      'play.title': "Don't read about it. Play it.",
      'play.sub': 'This is a working slice of CaudalFlow, running in mock mode right here on the page.',
      'mission.1': 'Branch from a phrase',
      'mission.2': 'Select two nodes',
      'mission.3': 'Merge & synthesize',
      'mission.doneBody': "Full loop complete — branch, explore, merge. That's the whole product. Now imagine it with your model, your topics, your canvas.",
      'mission.reset': 'Reset playground',
      'chrome.replay': 'Reset',
      'chrome.workspace': 'Workspace · Landing demo',
      'chrome.zoomIn': 'Zoom in',
      'chrome.zoomOut': 'Zoom out',
      'chrome.zoomFit': 'Fit view',
      'sel.label': 'Selection:',
      'sel.explore': 'Explore',
      'sel.send': 'Send',
      'merge.title': 'Merge {count} nodes',
      'merge.placeholder': 'What should I do with these?',
      'merge.compare': 'Compare',
      'merge.summarize': 'Summarize',
      'merge.connections': 'Connections',
      'merge.parentsNote': '{count} parents · full context inherited',
      'node.collapse': 'Collapse',
      'node.expand': 'Expand',
      'node.close': 'Close',
      'node.deleteTitle': 'Delete this chat?',
      'node.deleteBody': 'This removes "{topic}" and its conversation history.',
      'node.delete': 'Delete',
      'node.cancel': 'Cancel',
      'node.color': 'Add label and color',
      'node.askSomething': 'Ask something...',
      'hint.0': 'Psst — the <strong>dotted phrases</strong> in the answer are branchable. Click one.',
      'hint.1': 'Branch created. Now <strong>select two nodes</strong> — click their headers, or drag a box on empty canvas.',
      'hint.2': 'Two selected. Pick an action — <strong>Compare, Summarize, or Connections</strong>.',
      'hint.3': 'Loop complete. Drag node handles to spawn nodes, branch deeper, or hit Reset — or let the <strong>AI demo</strong> drive.',
      'hint.exported': 'Exported <strong>caudalflow-demo.md</strong> — that\'s the real export format.',
      'hint.demoDone': 'That was the copilot doing what you just did by hand — 12 tools, any order. Branch from the new answers to keep going.',
      'node.newTopic': 'New chat',
      'chat.empty': 'Ask a question to start exploring',
      'toolbox.title': 'The loop above is the product. This is the rest of it.',
      'toolbox.sub': "Everything below is in the repo today — no roadmap asterisks.",
      'toolbox.copilotTitle': 'An AI copilot that operates the canvas',
      'toolbox.copilotBody': 'Not a chat bolted to the side. The agent receives your canvas state — synced every 80 ms — and acts on it through 12 frontend tools:',
      'toolbox.demoCta': 'Watch the copilot run it',
      'toolbox.modelTitle': 'Bring your own model',
      'toolbox.modelBody': 'Any OpenAI-compatible endpoint — configure and go.',
      'toolbox.localTitle': 'Local-first, key-optional',
      'toolbox.localBody': 'Everything persists to localStorage. Mock mode needs no API key; real keys live in your settings or the optional BFF — never in the repo.',
      'toolbox.tagsTitle': 'Workspaces & color tags',
      'toolbox.tagsBody': 'Organize explorations into workspaces. Tag nodes with colors and labels — the palette above is the real one.',
      'toolbox.exportTitle': 'Markdown export — try it above',
      'toolbox.exportBody': 'The Export button in the demo canvas produces exactly this file — whole tree, hierarchy intact, ready for docs & panels.',
      'quick.title': 'Running in under a minute',
      'quick.mockNote': '# Mock mode — explore the canvas with zero API keys',
      'quick.note': 'Or fork it and import to Vercel — the BFF deploys as a serverless function via vercel.json.',
      'cta.title': 'Start branching in minutes.',
      'cta.body': 'Fork, import to Vercel, or run locally — mock mode works with no API key at all.',
      'cta.primary': 'Get it on GitHub',
      'cta.copied': 'Copied',
      'cta.copy': 'Copy clone command',
      'footer.meta': 'MIT License · Built for divergent thinking',
      'footer.repo': 'Source on GitHub',
      /* playground scripts */
      'node.root': 'How should we design auth?',
      'phrase.oauth': 'OAuth 2.0 + PKCE',
      'phrase.passkeys': 'Passkeys (WebAuthn)',
      'phrase.revocation': 'Session revocation',
      'phrase.fallback': 'fallback ladder',
      'script.rootUser': 'We\'re building a new app. How should we design authentication?',
      'script.rootBot': 'Two strong options for a modern app:\n\n[[oauth|OAuth 2.0 + PKCE]] is the workhorse — battle-tested, plugs into every identity provider, and PKCE closes the code-interception hole for mobile and SPA clients. Cost: you own refresh-token rotation and revocation.\n\n[[passkeys|Passkeys (WebAuthn)]] eliminate passwords outright — phishing-resistant, ~2-second sign-in, synced across devices. Cost: recovery UX is the hard part, and legacy devices still need a fallback.\n\nOne of these should be primary, the other a fallback. Which way to lean depends on your users — pick a dotted phrase above and I\'ll go deeper.',
      'script.oauthTopic': 'OAuth deep dive',
      'script.oauthBot': 'The plumbing nobody warns you about:\n\n- **Access tokens** — keep TTL ≤ 15 min. Short-lived means a leaked token is a small fire, not a data breach.\n- **Refresh rotation** — rotate on every use; replaying a rotated token should kill the whole family.\n- **[[revocation|Session revocation]]** — the genuinely annoying one: either run token introspection, or accept that revocation ≈ waiting out the TTL.\n\nNone of it is hard. All of it is forever.',
      'script.passkeysTopic': 'Passkeys research',
      'script.passkeysBot': 'Three things, in order of how often they bite:\n\n- **Recovery** — you need a [[fallback|fallback ladder]]: a second passkey on another device, one-time codes, an email link as the last resort. Lose the ladder and users lose accounts.\n- **Device coverage** — iOS 16+, Android 9+, all major browsers. Older fleets need a password bridge for years.\n- **Enterprise policy** — WebAuthn attestation and credential management need tuning for SSO-heavy orgs.\n\nConsumer app: passkey-first is a clear win. B2B: budget for the bridge.',
      'script.revocationTopic': 'Revocation strategies',
      'script.revocationBot': 'Two camps:\n\n- **Short-TTL pragmatists** — 10–15 minute access tokens, no introspection. Revocation means "wait it out." Simple, boring, and honestly fine for most apps.\n- **Introspection purists** — every request checks back with the auth server. Instant revocation, but an extra hop on every call and cache-invalidation homework.\n\nMost teams start as pragmatists and only add introspection when a compliance requirement forces their hand.',
      'script.fallbackTopic': 'Recovery ladder design',
      'script.fallbackBot': 'A ladder that actually works, bottom-up:\n\n- **Rung 1 — a second passkey** registered on another device or a hardware key. Survives phone-loss, zero support tickets.\n- **Rung 2 — one-time recovery codes** generated at enrollment, stored offline. Boring, essential.\n- **Rung 3 — an email magic link** as the last resort. It reintroduces a phishable path, so rate-limit and monitor it hard.\n\nRule of thumb: every rung is weaker than the one above it — and log which rung people actually land on. That\'s your UX quality signal.',
      'script.mergeTopic': 'Unified auth recommendation',
      'script.mergeGenericTopic': 'Merge synthesis',
      'script.mergeCompare': '**Side by side:**\n\n- **Threat model** — OAuth secures the *transport* of identity; passkeys secure the *proof*. Different problems, complementary fixes.\n- **Operational weight** — OAuth is token plumbing you own forever; passkeys shift ceremony to the platform but leave you the recovery ladder.\n- **Maturity** — OAuth is everywhere and boring (a compliment). Passkeys are past the early-adopter phase; recovery UX is still the weak flank.\n\nThe verdict most teams converge on: **passkeys primary, OAuth federation for SSO**, passwords as the shrinking fallback.',
      'script.mergeSummarize': 'Both threads answer the same question from opposite flanks: OAuth is the mature, plumbing-heavy default; passkeys are the better UX with a recovery tax. Synthesis: passkey-first sign-in, OAuth underneath for federation and enterprise SSO, short-TTL tokens everywhere. Decide with your device fleet and compliance posture — not by hype.',
      'script.mergeConnections': 'The connection most teams miss: **WebAuthn rides on top of OAuth**. A passkey can authenticate the OAuth flow itself — so this isn\'t a fork in the road, it\'s a stack. The real design decision is only *which layer faces the user*. Everything else — token TTLs, rotation, revocation — stays the same either way.',
      'script.mergeGeneric': 'Synthesizing **{A}** and **{B}**: both threads orbit the same underlying question — what does this cost, and who pays it. {A} leans toward the operational answer; {B} toward the user-facing one. The merged takeaway: find the constraint that actually binds you, and let it choose.',
      'script.branchGeneric': 'The useful framing for **{sel}**: split it into the happy path, the failure path, and the cost of being wrong. In the product, this node carries the parent\'s full context and streams from your configured model — this demo runs mock mode, but the branching mechanics are exactly what you just used.',
      'script.mockReply': 'I\'m in mock mode here — this demo runs on a script, not a model. But the mechanics are the real ones: this node carries its inherited context, and with a provider configured (Anthropic, OpenAI, DeepSeek, Ollama…), this exact box streams a real answer.',
    },
    zh: {
      'nav.github': 'GitHub',
      'hero.eyebrow': '开源 · 可视化 AI 画布',
      'hero.title': '每个想法，都值得一次侧线探索。',
      'hero.sub': '在无限画布上分支任意对话、并行探索、再把洞察合并回来——还有一个能直接操控画布的 AI 副驾驶。下面的画布是真的：直接上手玩。',
      'hero.ctaPrimary': '打开 GitHub',
      'hero.ctaSecondary': '现场玩一下画布',
      'nav.lang': '切换语言',
      'nav.theme': '切换主题',
      'play.title': '别看介绍，直接玩。',
      'play.sub': '这是 CaudalFlow 的一块真实切片，正在本页以 mock 模式运行。',
      'mission.1': '从短语分支',
      'mission.2': '选中两个节点',
      'mission.3': '合并综合',
      'mission.doneBody': '完整闭环走完了——分支、探索、合并，这就是产品的全部灵魂。换上你自己的模型、你自己的话题、你自己的画布试试。',
      'mission.reset': '重置演示',
      'chrome.replay': '重置',
      'chrome.workspace': '工作区 · 落地页演示',
      'chrome.aiDemo': 'AI 演示',
      'chrome.export': '导出 MD',
      'chrome.zoomIn': '放大',
      'chrome.zoomOut': '缩小',
      'chrome.zoomFit': '适应视图',
      'sel.label': '选中：',
      'sel.explore': '探索',
      'sel.send': '发送',
      'merge.title': '合并 {count} 个节点',
      'merge.placeholder': '要我对它们做什么？',
      'merge.compare': '对比',
      'merge.summarize': '总结',
      'merge.connections': '找关联',
      'merge.parentsNote': '{count} 个父节点 · 继承完整上下文',
      'node.collapse': '折叠',
      'node.expand': '展开',
      'node.close': '关闭',
      'node.deleteTitle': '删除这个对话？',
      'node.deleteBody': '这将移除「{topic}」及其对话历史。',
      'node.delete': '删除',
      'node.cancel': '取消',
      'node.color': '添加颜色标签',
      'node.askSomething': '问点什么……',
      'hint.0': '嘘——回答里的<strong>虚线短语</strong>可以分支。点一个试试。',
      'hint.1': '分支已生成。现在<strong>选中两个节点</strong>——点它们的头部，或在空白处拖一个框。',
      'hint.2': '已选中两个。选一个动作——<strong>对比、总结、找关联</strong>。',
      'hint.3': '闭环完成。拖节点手柄长出新节点、继续分支，或点重置——也可以让 <strong>AI 演示</strong>替你跑。',
      'hint.exported': '已导出 <strong>caudalflow-demo.md</strong>——这就是真实的导出格式。',
      'hint.demoDone': '刚才就是副驾驶替你跑的完整闭环——12 个工具，任意组合。从新回答里继续分支试试。',
      'node.newTopic': '新对话',
      'chat.empty': '问一个问题，开始探索',
      'toolbox.title': '上面的闭环就是产品本体，这里是其余部分。',
      'toolbox.sub': '以下全部都在今天的仓库里——没有画饼项。',
      'toolbox.copilotTitle': '会操作画布的 AI 副驾驶',
      'toolbox.copilotBody': '不是挂在旁边的聊天窗。agent 每 80ms 同步一次你的画布状态，并通过 12 个前端工具直接动手：',
      'toolbox.demoCta': '看副驾驶跑一遍',
      'toolbox.modelTitle': '自带你的模型',
      'toolbox.modelBody': '任意 OpenAI 兼容端点——配置即用。',
      'toolbox.localTitle': '本地优先，key 可选',
      'toolbox.localBody': '所有状态写入 localStorage。Mock 模式无需 API key；真实密钥只存在你的设置或可选 BFF 里——绝不进仓库。',
      'toolbox.tagsTitle': '工作区与颜色标签',
      'toolbox.tagsBody': '把探索整理进不同工作区，用颜色和标签标记节点——上面的调色盘就是产品同款。',
      'toolbox.exportTitle': 'Markdown 导出——上面就能试',
      'toolbox.exportBody': '演示画布里的导出按钮，产出的就是这份文件——整棵树、层级完整，直接拿去写文档、做汇报。',
      'quick.title': '一分钟内跑起来',
      'quick.mockNote': '# Mock 模式——零 API key 也能玩画布',
      'quick.note': '或者 fork 后导入 Vercel——BFF 会按 vercel.json 自动部署为 serverless 函数。',
      'cta.title': '几分钟就能开始分支。',
      'cta.body': 'Fork、导入 Vercel 或本地运行——mock 模式完全不需要 API key。',
      'cta.primary': '在 GitHub 获取',
      'cta.copied': '已复制',
      'cta.copy': '复制 clone 命令',
      'footer.meta': 'MIT 许可 · 为发散思考而建',
      'footer.repo': '源码在 GitHub',
      /* playground scripts */
      'node.root': '我们该如何设计鉴权？',
      'phrase.oauth': 'OAuth 2.0 + PKCE',
      'phrase.passkeys': 'Passkeys（WebAuthn）',
      'phrase.revocation': '会话吊销',
      'phrase.fallback': '降级梯',
      'script.rootUser': '我们要做一款新应用，鉴权该怎么设计？',
      'script.rootBot': '现代应用基本两条主线：\n\n[[oauth|OAuth 2.0 + PKCE]] 是老黄牛——久经考验、接得上所有身份提供商，PKCE 还堵住了移动端/SPA 的授权码拦截漏洞。代价：刷新令牌的轮换与吊销得自己扛。\n\n[[passkeys|Passkeys（WebAuthn）]] 干脆消灭密码——防钓鱼、约 2 秒登录、跨设备同步。代价：找回体验是硬骨头，老设备还得留后路。\n\n一个当主路、一个当备份。怎么倾斜取决于你的用户——点上面的虚线短语，我带你往下走。',
      'script.oauthTopic': 'OAuth 深潜',
      'script.oauthBot': '没人提前告诉你的管道活：\n\n- **访问令牌**——TTL 压到 15 分钟以内。泄露了也只是小火苗，不是数据泄露。\n- **刷新轮换**——每次使用即轮换；旧令牌被重放就该整族作废。\n- **[[revocation|会话吊销]]**——真正烦人的那环：要么上令牌内省，要么接受"吊销≈等它过期"。\n\n没有一件难，但每一件都是 forever。',
      'script.passkeysTopic': 'Passkeys 调研',
      'script.passkeysBot': '按踩坑频率排序的三件事：\n\n- **找回**——得备好 [[fallback|降级梯]]：另一台设备上的第二把 passkey、一次性恢复码、最后兜底的邮件链接。梯子丢了，账号就丢了。\n- **设备覆盖**——iOS 16+、Android 9+、主流浏览器全支持；老设备群还得架几年密码桥。\n- **企业策略**——重度 SSO 的组织需要调 WebAuthn 证明与凭据管理。\n\n消费者应用：passkey 优先明确划算。B2B：给桥留预算。',
      'script.revocationTopic': '吊销策略',
      'script.revocationBot': '两大流派：\n\n- **短 TTL 实用派**——10–15 分钟访问令牌，不上内省。吊销就是"等它过期"。简单、无聊，对多数应用说实话够用。\n- **内省洁癖派**——每个请求都回源校验。吊销即时生效，代价是每条调用多一跳，外加缓存失效作业。\n\n多数团队从实用派起步，直到合规要求逼着上内省。',
      'script.fallbackTopic': '找回阶梯设计',
      'script.fallbackBot': '一架真正好用的梯子，自底向上：\n\n- **第一级——第二把 passkey**：注册时在另一台设备或硬件钥匙上多绑一把。手机丢了不慌，零工单。\n- **第二级——一次性恢复码**：注册时生成、离线保存。无聊，但不可缺。\n- **第三级——邮件魔法链接**：最后兜底。它重新引入了可钓鱼路径，所以要狠狠限流加监控。\n\n经验法则：每一级都比上一级更弱——并记录用户实际落在哪一级，那就是你的体验质量信号。',
      'script.mergeTopic': '统一鉴权建议',
      'script.mergeGenericTopic': '合并综合',
      'script.mergeCompare': '**并排看：**\n\n- **威胁模型**——OAuth 保的是身份的*传输*，passkeys 保的是身份的*证明*。不同问题，互补解法。\n- **运维负担**——OAuth 是你要养一辈子的令牌管道；passkeys 把仪式感交给平台，但降级梯留给你。\n- **成熟度**——OAuth 无处不在且无聊（这是夸奖）；passkeys 已过尝鲜期，找回体验仍是软肋。\n\n多数团队收敛到的结论：**passkeys 为主、OAuth 做联邦/SSO，密码退居缩小的后备**。',
      'script.mergeSummarize': '两条线从两翼回答同一个问题：OAuth 是成熟但管道沉重的默认解；passkeys 是体验更好但收找回税的新解。综合结论：passkey 优先的登录、底层用 OAuth 做联邦与企业 SSO、全链路短 TTL 令牌。用设备群和合规姿态决策——别用热度。',
      'script.mergeConnections': '多数团队漏掉的连接：**WebAuthn 可以跑在 OAuth 之上**——passkey 可以直接认证 OAuth 流程本身。所以这不是岔路口，是叠层。真正的设计决策只有一个：*哪一层面向用户*。其余的（令牌 TTL、轮换、吊销）殊途同归。',
      'script.mergeGeneric': '综合 **{A}** 与 **{B}**：两条线都在绕同一个底层问题——这事代价几何、谁付。{A} 偏运维侧答案，{B} 偏用户侧答案。合并后的要点：找到真正卡住你的那个约束，让它来拍板。',
      'script.branchGeneric': '**{sel}** 的有效拆法：切成 happy path、failure path、以及"错了的代价"三块。产品里这个节点会带着父对话的完整上下文、从你配置的模型流式输出——这段演示跑的是 mock 模式，但你刚用过的分支机制和真机一模一样。',
      'script.mockReply': '我在这里是 mock 模式——这段演示跑的是剧本，不是模型。但机制是真的：这个节点带着继承来的上下文，配置好提供商（Anthropic、OpenAI、DeepSeek、Ollama……）后，就是这个输入框流出真实回答。',
    },
  };

  let lang = 'en';

  function t(key, vars) {
    let s = dict[lang][key] ?? dict.en[key] ?? key;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        s = s.split('{' + k + '}').join(String(vars[k]));
      });
    }
    return s;
  }

  const prefersReduced = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ————————————————— mini markdown ————————————————— */

  function esc(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function inlineMd(text) {
    return text
      .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (_m, key, label) => {
        return `<button type="button" class="bphrase" data-key="${esc(key)}" data-text="${esc(label)}">${esc(label)}</button>`;
      })
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }

  function renderMarkdown(src) {
    const blocks = src.split(/\n\n+/);
    return blocks
      .map((block) => {
        const lines = block.split('\n');
        const out = [];
        let list = null;
        let para = [];
        const flushPara = () => {
          if (para.length) {
            out.push(`<p>${para.join('<br>')}</p>`);
            para = [];
          }
        };
        lines.forEach((line) => {
          if (/^- /.test(line)) {
            flushPara();
            if (!list) list = [];
            list.push(`<li>${inlineMd(line.slice(2))}</li>`);
          } else {
            if (list) {
              out.push(`<ul>${list.join('')}</ul>`);
              list = null;
            }
            para.push(inlineMd(line));
          }
        });
        if (list) out.push(`<ul>${list.join('')}</ul>`);
        flushPara();
        return out.join('');
      })
      .join('');
  }

  /* ————————————————— playground state ————————————————— */

  const NODE_W = 340;
  const CANVAS_W0 = 1240;
  const CANVAS_H0 = 700;

  const state = {
    nodes: [],
    edges: [],
    selected: new Set(),
    zoom: 1,
    userZoomed: false,
    mission: 0, // 0 branch · 1 select · 2 merge · 3 done
    canvasW: CANVAS_W0,
    canvasH: CANVAS_H0,
  };

  let streamToken = 0;
  let playgroundGen = 0;
  let uid = 0;

  const $ = (id) => document.getElementById(id);
  const canvasEl = () => $('canvas');
  const nodesEl = () => $('nodes');
  const edgesG = () => $('edges');

  function nodeById(id) {
    return state.nodes.find((n) => n.id === id);
  }

  function nodeTopic(n) {
    if (n.topicKey) return t(n.topicKey);
    return n.topicRaw || '';
  }

  function nodeH(n) {
    return n.el ? n.el.offsetHeight : 300;
  }

  /* ————————————————— node render ————————————————— */

  const SVG_NS = 'http://www.w3.org/2000/svg';

  function svgIcon(d, size) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="${d}"/></svg>`;
  }

  function messageHtml(m) {
    if (m.role === 'user') {
      const text =
        m.raw != null
          ? esc(m.raw)
          : esc(m.key ? t(m.key) : t(m.fallbackKey || 'sel.explore'));
      const quote = m.quoteKey
        ? `<span class="pmsg-quote">${esc(t(m.quoteKey))}</span>`
        : m.quoteRaw
          ? `<span class="pmsg-quote">${esc(m.quoteRaw)}</span>`
          : '';
      const note = m.noteKey
        ? `<span class="pmsg-quote">${esc(t(m.noteKey, m.noteVars || {}))}</span>`
        : '';
      return `<div class="pmsg pmsg-user">${text}${quote}${note}</div>`;
    }
    return `<div class="pmsg pmsg-bot">${renderMarkdown(m.key ? t(m.key) : m.raw || '')}</div>`;
  }

  function renderNodeContent(n) {
    const bodyHtml = n.messages.length
      ? n.messages.map(messageHtml).join('')
      : `<div class="pmsg pmsg-empty">${esc(t('chat.empty'))}</div>`;
    n.el.querySelector('.pnode-body').innerHTML = bodyHtml;
    n.el.querySelector('.pnode-topic-pill').textContent = nodeTopic(n);
    const dot = n.el.querySelector('.pnode-color-dot');
    if (n.color) {
      n.el.setAttribute('data-color', n.color);
      dot.classList.remove('hidden');
    } else {
      n.el.removeAttribute('data-color');
      dot.classList.add('hidden');
    }
    const input = n.el.querySelector('.pnode-input input');
    if (input) input.placeholder = t('node.askSomething');
    n.el.classList.toggle('is-collapsed', !!n.collapsed);
    n.el.classList.toggle('is-selected', state.selected.has(n.id));
    n.el.style.width = (n.collapsed ? 160 : (n.w || NODE_W)) + 'px';
  }

  function buildNodeEl(n) {
    const el = document.createElement('article');
    el.className = 'pnode';
    el.dataset.id = n.id;
    el.setAttribute('aria-label', nodeTopic(n));
    el.innerHTML = `
      <div class="pnode-handle left"></div><div class="pnode-handle right"></div>
      <header class="pnode-head">
        <button type="button" class="pnode-btn pnode-collapse" aria-label="${esc(t('node.collapse'))}">${svgIcon('M6 9l6 6 6-6', 14).replace('<svg', '<svg class="chev"')}</button>
        <span class="pnode-topic">
          <span class="pnode-color-dot hidden"></span>
          <span class="pnode-topic-pill"></span>
        </span>
        <button type="button" class="pnode-btn pnode-palette-btn" aria-label="${esc(t('node.color'))}">${svgIcon('M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 0-4h-1a5 5 0 1 1 5-5 2 2 0 0 0 2 2 2 2 0 0 0 2-2 9 9 0 0 0-9-9z', 14)}</button>
        <button type="button" class="pnode-btn pnode-close" aria-label="${esc(t('node.close'))}">${svgIcon('M18 6L6 18M6 6l12 12', 14)}</button>
      </header>
      <div class="pnode-body" aria-live="polite"></div>
      <div class="pnode-input">
        <input type="text" autocomplete="off" />
        <button type="button" class="pnode-send" aria-label="${esc(t('sel.send'))}">${svgIcon('M5 12h14M12 5l7 7-7 7', 14)}</button>
      </div>`;
    n.el = el;
    renderNodeContent(n);
    positionNode(n);
    bindNode(n);
    nodesEl().appendChild(el);
    return el;
  }

  function positionNode(n) {
    n.el.style.left = n.x + 'px';
    n.el.style.top = n.y + 'px';
  }

  /* ————————————————— edges ————————————————— */

  function edgePathD(from, to) {
    const x1 = from.x + (from.collapsed ? 160 : from.w || NODE_W);
    const y1 = from.y + nodeH(from) / 2;
    const x2 = to.x;
    const y2 = to.y + nodeH(to) / 2;
    const dx = Math.max(46, (x2 - x1) * 0.45);
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2 - 6} ${y2}`;
  }

  function redrawEdges() {
    const g = edgesG();
    g.innerHTML = '';
    state.edges.forEach((e) => {
      const from = nodeById(e.from);
      const to = nodeById(e.to);
      if (!from || !to) return;
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('class', 'flow-edge' + (e.hot ? ' is-hot' : ''));
      path.setAttribute('d', edgePathD(from, to));
      g.appendChild(path);
      const label = e.labelKey ? t(e.labelKey) : e.labelRaw;
      if (label) {
        const mid = path.getPointAtLength(path.getTotalLength() / 2);
        const text = document.createElementNS(SVG_NS, 'text');
        text.setAttribute('class', 'edge-label');
        text.setAttribute('x', mid.x);
        text.setAttribute('y', mid.y - 6);
        text.setAttribute('text-anchor', 'middle');
        text.textContent = label.length > 26 ? label.slice(0, 25) + '…' : label;
        g.appendChild(text);
      }
    });
  }

  function animateEdge(e) {
    const path = edgesG().querySelectorAll('path')[state.edges.indexOf(e)];
    if (!path || prefersReduced()) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len);
    path.classList.add('is-drawing');
    requestAnimationFrame(() => {
      path.style.strokeDashoffset = '0';
    });
    setTimeout(() => {
      path.style.strokeDasharray = '';
      path.style.strokeDashoffset = '';
      path.classList.remove('is-drawing');
    }, 650);
  }

  /* ————————————————— layout ————————————————— */

  function growCanvas(w, h) {
    let dirty = false;
    if (w > state.canvasW) { state.canvasW = w; dirty = true; }
    if (h > state.canvasH) { state.canvasH = h; dirty = true; }
    if (dirty) applyCanvasSize();
  }

  function applyCanvasSize() {
    const c = canvasEl();
    c.style.width = state.canvasW + 'px';
    c.style.height = state.canvasH + 'px';
    const svg = $('edge-svg');
    svg.setAttribute('viewBox', `0 0 ${state.canvasW} ${state.canvasH}`);
    if (!state.userZoomed) fitZoom();
    else applyZoom();
  }

  function rectsOverlap(a, b) {
    const ah = a.collapsed ? 60 : nodeH(a);
    const bh = b.collapsed ? 60 : nodeH(b);
    const aw = a.collapsed ? 160 : a.w || NODE_W;
    const bw = b.collapsed ? 160 : b.w || NODE_W;
    return a.x < b.x + bw + 20 && a.x + aw + 20 > b.x && a.y < b.y + bh + 16 && a.y + ah + 16 > b.y;
  }

  function resolveCollisions(n) {
    for (let guard = 0; guard < 30; guard++) {
      const hit = state.nodes.find((m) => m !== n && !m.deleted && rectsOverlap(n, m));
      if (!hit) break;
      n.y = hit.y + (hit.collapsed ? 60 : nodeH(hit)) + 24;
    }
    const h = n.el.offsetHeight;
    if (n.y + h + 30 > state.canvasH) {
      state.canvasH = n.y + h + 40;
      applyCanvasSize();
    }
    positionNode(n);
  }

  function spotFor(parent, w) {
    let x = parent.x + (parent.collapsed ? 160 : parent.w || NODE_W) + 84;
    const maxRight = parent.x + 1000;
    if (x + w > Math.min(CANVAS_W0 - 10, maxRight)) {
      x = CANVAS_W0 - w - 20;
    }
    return x;
  }

  /* ————————————————— streaming ————————————————— */

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function streamBotMessage(n, key, raw) {
    const token = ++streamToken;
    const body = n.el.querySelector('.pnode-body');
    const div = document.createElement('div');
    div.className = 'pmsg pmsg-bot';
    body.appendChild(div);
    const full = key ? t(key) : raw || '';

    if (prefersReduced()) {
      div.innerHTML = renderMarkdown(full);
      finishNode(n);
      return;
    }

    const step = 3;
    const tick = 14;
    for (let i = 0; i <= full.length; i += step) {
      if (token !== streamToken) return;
      div.innerHTML = renderMarkdown(full.slice(0, i)) + '<span class="pmsg-caret"></span>';
      body.scrollTop = body.scrollHeight;
      await sleep(tick);
    }
    if (token !== streamToken) return;
    div.innerHTML = renderMarkdown(full);
    body.scrollTop = body.scrollHeight;
    finishNode(n);
  }

  function finishNode(n) {
    growCanvas(n.x + (n.w || NODE_W) + 30, n.y + nodeH(n) + 30);
    redrawEdges();
  }

  /* ————————————————— interactions: branch ————————————————— */

  let selCtx = null; // {parentId, key, text}

  function openSelPopup(btn) {
    const parentId = btn.closest('.pnode').dataset.id;
    const key = btn.dataset.key;
    const text = btn.dataset.text || t('phrase.' + key);
    selCtx = { parentId, key, text };
    const popup = $('sel-popup');
    $('sel-text').textContent = '"' + (text.length > 40 ? text.slice(0, 39) + '…' : text) + '"';
    const input = $('sel-input');
    input.value = '';
    input.placeholder = t('sel.label') === '选中：' ? `就「${text.slice(0, 18)}」问点……` : `Ask about "${text.slice(0, 22)}"`;

    const cRect = canvasEl().getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    const z = state.zoom;
    let x = (bRect.left - cRect.left) / z + bRect.width / z / 2 - 150;
    let y = (bRect.top - cRect.top) / z - 10;
    x = Math.max(8, Math.min(state.canvasW - 308, x));
    y = Math.max(8, y);
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    popup.style.transform = 'translateY(-100%)';
    popup.hidden = false;
    setTimeout(() => input.focus(), 40);
    popup.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  function closeSelPopup() {
    $('sel-popup').hidden = true;
    selCtx = null;
  }

  function submitSelection() {
    if (!selCtx) return;
    const prompt = $('sel-input').value.trim();
    const { parentId, key, text } = selCtx;
    closeSelPopup();
    createBranch(parentId, key, text, prompt);
  }

  function markPhraseUsed(key) {
    nodesEl().querySelectorAll(`.bphrase[data-key="${key}"]`).forEach((b) => {
      b.classList.add('is-used');
    });
  }

  function createBranch(parentId, key, text, prompt) {
    const parent = nodeById(parentId);
    if (!parent) return Promise.resolve();
    const script = key && dict.en['script.' + key + 'Bot'] ? key : null;
    if (key) markPhraseUsed(key);

    const n = {
      id: 'n' + ++uid,
      kind: 'branch',
      topicKey: script ? 'script.' + script + 'Topic' : null,
      topicRaw: script ? null : text.slice(0, 24),
      x: 0,
      y: 0,
      w: NODE_W,
      color: null,
      collapsed: false,
      messages: [
        {
          role: 'user',
          raw: prompt || null,
          fallbackKey: 'sel.explore',
          quoteKey: 'phrase.' + key,
        },
        // bot message appended by stream
      ],
    };

    n.x = spotFor(parent, n.w);
    n.y = Math.max(24, parent.y - 60);

    state.nodes.push(n);
    buildNodeEl(n);
    resolveCollisions(n);

    const edge = {
      id: 'e' + uid,
      from: parentId,
      to: n.id,
      labelKey: 'phrase.' + key,
    };
    state.edges.push(edge);
    redrawEdges();
    animateEdge(edge);

    if (!prefersReduced()) {
      n.el.classList.add('is-new');
      setTimeout(() => n.el.classList.remove('is-new'), 500);
    }

    n.el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'nearest', inline: 'nearest' });

    const botKey = script && !prompt ? 'script.' + script + 'Bot' : null;
    const stream = botKey
      ? streamBotMessage(n, botKey, null)
      : streamBotMessage(n, null, t('script.branchGeneric', { sel: text }));

    advanceMission(1);
    return stream;
  }

  /* ————————————————— interactions: select & merge ————————————————— */

  function toggleSelect(n) {
    if (state.selected.has(n.id)) {
      state.selected.delete(n.id);
    } else {
      state.selected.add(n.id);
    }
    n.el.classList.toggle('is-selected', state.selected.has(n.id));
    updateMergePopup();
  }

  function clearSelection() {
    state.selected.forEach((id) => {
      const n = nodeById(id);
      if (n && n.el) n.el.classList.remove('is-selected');
    });
    state.selected.clear();
    updateMergePopup();
  }

  function updateMergePopup() {
    const popup = $('merge-popup');
    const sel = [...state.selected].map(nodeById).filter(Boolean);
    if (sel.length >= 2) {
      $('merge-title').textContent = t('merge.title', { count: sel.length });
      const topics = $('merge-topics');
      topics.innerHTML = sel
        .slice(0, 5)
        .map((n) => `<span class="merge-topic">${esc(nodeTopic(n))}</span>`)
        .join('');
      if (sel.length > 5) {
        topics.innerHTML += `<span class="merge-topic">+${sel.length - 5}</span>`;
      }
      $('merge-input').value = '';
      $('merge-input').placeholder = t('merge.placeholder');
      popup.hidden = false;
      if (state.mission < 2) advanceMission(2);
    } else {
      popup.hidden = true;
    }
  }

  function submitMerge(actionKey, actionRaw) {
    const sel = [...state.selected].map(nodeById).filter(Boolean);
    if (sel.length < 2) return Promise.resolve();
    clearSelection();
    closeSelPopup();
    return mergeNodes(sel, actionKey, actionRaw);
  }

  function mergeNodes(sel, actionKey, actionRaw) {
    sel = (sel || []).filter(Boolean);
    if (sel.length < 2) return Promise.resolve();
    const action = actionRaw || t(actionKey);
    const canonical =
      sel.some((n) => n.topicKey === 'script.oauthTopic') &&
      sel.some((n) => n.topicKey === 'script.passkeysTopic');

    const maxX = Math.max(...sel.map((n) => n.x + (n.w || NODE_W)));
    const avgY = sel.reduce((s, n) => s + n.y, 0) / sel.length;

    const n = {
      id: 'n' + ++uid,
      kind: 'merge',
      topicKey: canonical ? 'script.mergeTopic' : 'script.mergeGenericTopic',
      topicRaw: null,
      x: Math.min(maxX + 84, CANVAS_W0 - NODE_W - 20),
      y: Math.max(24, avgY),
      w: NODE_W,
      color: null,
      collapsed: false,
      messages: [
        {
          role: 'user',
          raw: actionRaw || null,
          fallbackKey: actionKey,
          noteKey: 'merge.parentsNote',
          noteVars: { count: sel.length },
        },
      ],
    };

    state.nodes.push(n);
    buildNodeEl(n);
    resolveCollisions(n);

    sel.forEach((p) => {
      const edge = { id: 'e' + uid + Math.random().toString(36).slice(2, 6), from: p.id, to: n.id, labelRaw: action };
      state.edges.push(edge);
      animateEdge(edge);
    });
    redrawEdges();

    if (!prefersReduced()) {
      n.el.classList.add('is-new', 'is-merged-glow');
      setTimeout(() => n.el.classList.remove('is-new', 'is-merged-glow'), 1500);
    }
    n.el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'nearest', inline: 'nearest' });

    let botKey = null;
    let botRaw = null;
    if (canonical) {
      if (actionKey === 'merge.compare') botKey = 'script.mergeCompare';
      else if (actionKey === 'merge.summarize') botKey = 'script.mergeSummarize';
      else if (actionKey === 'merge.connections') botKey = 'script.mergeConnections';
    }
    if (!botKey) {
      botRaw = t('script.mergeGeneric', {
        A: nodeTopic(sel[0]),
        B: nodeTopic(sel[1] || sel[0]),
      });
    }
    const stream = streamBotMessage(n, botKey, botRaw);

    advanceMission(3);
    return stream;
  }

  /* ————————————————— node bindings ————————————————— */

  function bindNode(n) {
    const el = n.el;

    // drag (whole card, mouse/pen anywhere; touch = header only so body scroll survives) + click-to-select
    let dragging = false;
    let moved = false;
    let start = null;

    el.addEventListener('pointerdown', (ev) => {
      if (ev.target.closest('.pnode-btn, .bphrase, input, .pnode-handle, .pnode-palette, .pnode-confirm, .pmsg-user')) return;
      if (ev.button !== undefined && ev.button !== 0) return;
      if (ev.pointerType === 'touch' && !ev.target.closest('.pnode-head')) return;
      dragging = true;
      moved = false;
      const p = canvasPoint(ev);
      start = { px: p.x, py: p.y, nx: n.x, ny: n.y };
      closeSelPopup();
      el.classList.add('is-dragging');
      try { el.setPointerCapture(ev.pointerId); } catch (_) {}
      ev.preventDefault();
    });

    el.addEventListener('pointermove', (ev) => {
      if (!dragging) return;
      const p = canvasPoint(ev);
      const dx = p.x - start.px;
      const dy = p.y - start.py;
      if (Math.abs(dx) + Math.abs(dy) > 5) moved = true;
      if (!moved) return;
      n.x = Math.max(0, Math.min(state.canvasW - 60, start.nx + dx));
      n.y = Math.max(0, start.ny + dy);
      positionNode(n);
      growCanvas(n.x + (n.w || NODE_W) + 30, n.y + nodeH(n) + 30);
      redrawEdges();
    });

    const endDrag = (ev) => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('is-dragging');
      try { el.releasePointerCapture(ev.pointerId); } catch (_) {}
      if (!moved) toggleSelect(n);
    };
    el.addEventListener('pointerup', endDrag);
    el.addEventListener('pointercancel', endDrag);

    // handle-drag: connect to another node, or spawn a new one on empty canvas
    bindHandleLink(n);

    // collapse
    el.querySelector('.pnode-collapse').addEventListener('click', (ev) => {
      ev.stopPropagation();
      n.collapsed = !n.collapsed;
      renderNodeContent(n);
      setTimeout(redrawEdges, 260);
    });

    // palette
    el.querySelector('.pnode-palette-btn').addEventListener('click', (ev) => {
      ev.stopPropagation();
      togglePalette(n);
    });

    // close / delete
    el.querySelector('.pnode-close').addEventListener('click', (ev) => {
      ev.stopPropagation();
      toggleConfirm(n);
    });

    // chat input
    const input = el.querySelector('.pnode-input input');
    const send = el.querySelector('.pnode-send');
    const doSend = () => {
      const v = input.value.trim();
      if (!v) return;
      input.value = '';
      n.messages.push({ role: 'user', raw: v });
      const body = n.el.querySelector('.pnode-body');
      const empty = body.querySelector('.pmsg-empty');
      if (empty) empty.remove();
      body.insertAdjacentHTML('beforeend', messageHtml({ role: 'user', raw: v }));
      body.scrollTop = body.scrollHeight;
      streamBotMessage(n, 'script.mockReply', null);
    };
    send.addEventListener('click', doSend);
    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        doSend();
      }
    });

    // branchable phrases (event delegation — nodes re-render content)
    el.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.bphrase');
      if (btn && !btn.classList.contains('is-used')) {
        ev.stopPropagation();
        openSelPopup(btn);
      }
    });
  }

  function hitTestNode(m, p) {
    const w = m.collapsed ? 160 : m.w || NODE_W;
    const h = m.collapsed ? 60 : nodeH(m);
    return p.x >= m.x && p.x <= m.x + w && p.y >= m.y && p.y <= m.y + h;
  }

  function bindHandleLink(n) {
    const handle = n.el.querySelector('.pnode-handle.right');
    if (!handle) return;

    handle.addEventListener('pointerdown', (ev) => {
      if (ev.button !== undefined && ev.button !== 0) return;
      ev.stopPropagation();
      ev.preventDefault();
      closeSelPopup();

      const svg = $('edge-svg');
      const ghost = document.createElementNS(SVG_NS, 'path');
      ghost.setAttribute('class', 'link-ghost');
      svg.appendChild(ghost);
      try { handle.setPointerCapture(ev.pointerId); } catch (_) {}

      const drawTo = (e2) => {
        const p = canvasPoint(e2);
        const x1 = n.x + (n.collapsed ? 160 : n.w || NODE_W);
        const y1 = n.y + nodeH(n) / 2;
        ghost.setAttribute('d', `M ${x1} ${y1} C ${x1 + 44} ${y1}, ${Math.max(x1 + 8, p.x - 44)} ${p.y}, ${p.x} ${p.y}`);
        state.nodes.forEach((m) => {
          if (m.el) m.el.classList.toggle('is-link-target', m !== n && hitTestNode(m, p));
        });
      };
      drawTo(ev);

      const cleanup = () => {
        handle.removeEventListener('pointermove', drawTo);
        handle.removeEventListener('pointerup', onUp);
        handle.removeEventListener('pointercancel', onCancel);
        ghost.remove();
        state.nodes.forEach((m) => {
          if (m.el) m.el.classList.remove('is-link-target');
        });
      };
      const onUp = (e2) => {
        const p = canvasPoint(e2);
        cleanup();
        const target = state.nodes.find((m) => m !== n && hitTestNode(m, p));
        if (target) {
          if (!state.edges.some((e) => e.from === n.id && e.to === target.id)) {
            const edge = { id: 'e' + ++uid, from: n.id, to: target.id, labelRaw: null };
            state.edges.push(edge);
            redrawEdges();
            animateEdge(edge);
          }
          return;
        }
        if (p.x >= 0 && p.y >= 0 && p.x <= state.canvasW && p.y <= state.canvasH) {
          spawnEmptyNode(n, p);
        }
      };
      const onCancel = () => cleanup();

      handle.addEventListener('pointermove', drawTo);
      handle.addEventListener('pointerup', onUp);
      handle.addEventListener('pointercancel', onCancel);
    });
  }

  function spawnEmptyNode(parent, p) {
    const n = {
      id: 'n' + ++uid,
      kind: 'branch',
      topicKey: null,
      topicRaw: t('node.newTopic'),
      x: Math.max(0, Math.min(state.canvasW - NODE_W - 10, p.x - 50)),
      y: Math.max(0, p.y - 40),
      w: NODE_W,
      color: null,
      collapsed: false,
      messages: [],
    };
    state.nodes.push(n);
    buildNodeEl(n);
    resolveCollisions(n);

    const edge = { id: 'e' + ++uid, from: parent.id, to: n.id, labelRaw: null };
    state.edges.push(edge);
    redrawEdges();
    animateEdge(edge);

    if (!prefersReduced()) {
      n.el.classList.add('is-new');
      setTimeout(() => n.el.classList.remove('is-new'), 500);
    }
    n.el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'nearest', inline: 'nearest' });
    const input = n.el.querySelector('.pnode-input input');
    if (input) setTimeout(() => input.focus(), 140);
  }

  function closeNodePopovers(n) {
    n.el.querySelectorAll('.pnode-palette, .pnode-confirm').forEach((p) => p.remove());
  }

  function togglePalette(n) {
    const existing = n.el.querySelector('.pnode-palette');
    closeNodePopovers(n);
    if (existing) return;
    const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4'];
    const pop = document.createElement('div');
    pop.className = 'pnode-palette';
    pop.innerHTML = colors
      .map((c) => `<button type="button" style="background:${c}" class="${n.color === c ? 'is-on' : ''}" data-c="${c}" aria-label="${c}"></button>`)
      .join('');
    pop.addEventListener('click', (ev) => {
      const b = ev.target.closest('button[data-c]');
      if (!b) return;
      n.color = n.color === b.dataset.c ? null : b.dataset.c;
      renderNodeContent(n);
      closeNodePopovers(n);
    });
    n.el.appendChild(pop);
  }

  function toggleConfirm(n) {
    const existing = n.el.querySelector('.pnode-confirm');
    closeNodePopovers(n);
    if (existing) return;
    const pop = document.createElement('div');
    pop.className = 'pnode-confirm';
    pop.innerHTML = `
      <p class="confirm-title">${esc(t('node.deleteTitle'))}</p>
      <p class="confirm-body">${esc(t('node.deleteBody', { topic: nodeTopic(n) }))}</p>
      <div class="confirm-row">
        <button type="button" class="confirm-btn">${esc(t('node.cancel'))}</button>
        <button type="button" class="confirm-btn danger">${esc(t('node.delete'))}</button>
      </div>`;
    pop.addEventListener('click', (ev) => {
      const btn = ev.target.closest('button');
      if (!btn) return;
      if (btn.classList.contains('danger')) {
        deleteNode(n);
      } else {
        closeNodePopovers(n);
      }
    });
    n.el.appendChild(pop);
  }

  function deleteNode(n) {
    n.deleted = true;
    state.edges = state.edges.filter((e) => e.from !== n.id && e.to !== n.id);
    state.selected.delete(n.id);
    state.nodes = state.nodes.filter((m) => m !== n);
    n.el.remove();
    redrawEdges();
    updateMergePopup();
  }

  /* ————————————————— canvas helpers ————————————————— */

  function canvasPoint(ev) {
    const c = canvasEl();
    const r = c.getBoundingClientRect();
    return { x: (ev.clientX - r.left) / state.zoom, y: (ev.clientY - r.top) / state.zoom };
  }

  function applyZoom() {
    const z = state.zoom;
    const spacer = $('canvas-zoom');
    spacer.style.width = state.canvasW * z + 'px';
    spacer.style.height = state.canvasH * z + 'px';
    canvasEl().style.transform = `scale(${z})`;
  }

  function fitZoom() {
    const sc = $('canvas-scroll');
    const fit = sc.clientWidth / state.canvasW;
    state.zoom = Math.max(0.45, Math.min(1, fit));
    applyZoom();
  }

  /* ————————————————— mission ————————————————— */

  function setHint(idx) {
    $('stage-hint').innerHTML = t('hint.' + Math.min(idx, 3));
  }

  function advanceMission(step) {
    if (step <= state.mission) return;
    state.mission = step;
    const m = $('mission');
    const steps = [m.querySelector('#mission-1'), m.querySelector('#mission-2'), m.querySelector('#mission-3')];
    steps.forEach((el, i) => {
      el.classList.toggle('is-done', i < step);
      el.classList.toggle('is-active', i === step);
    });
    setHint(step);
    if (step >= 3) {
      $('mission-done').classList.remove('hidden');
    }
  }

  /* ————————————————— playground init / reset ————————————————— */

  function initPlayground() {
    streamToken++;
    playgroundGen++;
    state.nodes = [];
    state.edges = [];
    state.selected.clear();
    state.mission = 0;
    state.canvasW = CANVAS_W0;
    state.canvasH = CANVAS_H0;
    uid = 0;
    nodesEl().innerHTML = '';
    $('mission-done').classList.add('hidden');
    const m = $('mission');
    [1, 2, 3].forEach((i) => {
      const el = m.querySelector('#mission-' + i);
      el.classList.remove('is-done');
      el.classList.toggle('is-active', i === 1);
    });
    setHint(0);
    $('workspace-pill').textContent = t('chrome.workspace');
    $('reset-btn').querySelector('span').textContent = t('chrome.replay');

    const root = {
      id: 'n' + ++uid,
      kind: 'root',
      topicKey: 'node.root',
      topicRaw: null,
      x: 30,
      y: 250,
      w: NODE_W,
      color: null,
      collapsed: false,
      messages: [
        { role: 'user', key: 'script.rootUser' },
        { role: 'bot', key: 'script.rootBot' },
      ],
    };
    state.nodes.push(root);
    buildNodeEl(root);
    applyCanvasSize();
    redrawEdges();
  }

  /* ————————————————— static page wiring ————————————————— */

  function applyI18n() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key) el.textContent = t(key);
    });
    const langLabel = $('lang-label');
    if (langLabel) langLabel.textContent = lang === 'en' ? '中文' : 'EN';
    const langBtn = $('lang-toggle');
    if (langBtn) langBtn.setAttribute('aria-label', t('nav.lang'));
    const themeBtn = $('theme-toggle');
    if (themeBtn) themeBtn.setAttribute('aria-label', t('nav.theme'));
    const cloneBtn = $('clone-btn');
    if (cloneBtn) cloneBtn.setAttribute('aria-label', t('cta.copy'));
    ['zoom-in', 'zoom-out', 'zoom-fit'].forEach((id) => {
      const b = $(id);
      if (b) b.setAttribute('aria-label', t('chrome.' + (id === 'zoom-in' ? 'zoomIn' : id === 'zoom-out' ? 'zoomOut' : 'zoomFit')));
    });
    const mergeInput = $('merge-input');
    if (mergeInput) mergeInput.placeholder = t('merge.placeholder');
    // rebuild playground text in new language
    state.nodes.forEach((n) => {
      if (n.el) {
        closeNodePopovers(n);
        renderNodeContent(n);
      }
    });
    redrawEdges();
    updateMergePopup();
    setHint(state.mission);
    $('workspace-pill').textContent = t('chrome.workspace');
    $('reset-btn').querySelector('span').textContent = t('chrome.replay');
    const doneBtn = $('replay-link');
    if (doneBtn) doneBtn.textContent = t('mission.reset');
    wrapHeroTitle();
  }

  function setLang(next) {
    lang = next;
    try { localStorage.setItem('cf-lang', lang); } catch (_) {}
    applyI18n();
  }

  /* ————————————————— theme ————————————————— */

  function resolveTheme() {
    const stored = document.documentElement.getAttribute('data-theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const moon = $('theme-icon-moon');
    const sun = $('theme-icon-sun');
    if (moon && sun) {
      moon.classList.toggle('hidden', theme === 'light');
      sun.classList.toggle('hidden', theme === 'dark');
    }
  }

  /* ————————————————— hero words ————————————————— */

  function wrapHeroTitle() {
    const el = $('hero-title');
    if (!el) return;
    const raw = t('hero.title');
    if (prefersReduced()) {
      el.textContent = raw;
      return;
    }
    el.textContent = '';
    // Split: keep CJK runs as one word (per-character margin looks broken for CJK);
    // Latin splits on whitespace so per-word reveal still works.
    const cjk = '[\u4e00-\u9fff\uff0c\u3002\uff1f\uff01\u3001\u2026\u2014\u2018\u2019\u201c\u201d\uff08\uff09\u300a\u300b]';
    const parts = raw.match(new RegExp(`${cjk}+|[A-Za-z0-9']+|[^\\s]`, 'g')) || [raw];
    parts.forEach((part, i) => {
      const word = document.createElement('span');
      word.className = 'word';
      const inner = document.createElement('span');
      inner.textContent = part;
      inner.style.animationDelay = `${0.18 + i * 0.045}s`;
      word.appendChild(inner);
      el.appendChild(word);
    });
  }

  /* ————————————————— reveals / terminal / copy / magnetic ————————————————— */

  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    const showAll = () => items.forEach((el) => el.classList.add('is-visible'));
    if (prefersReduced() || !('IntersectionObserver' in window)) {
      showAll();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );
    items.forEach((el) => io.observe(el));
    setTimeout(showAll, 4500);
  }

  function initTerminal() {
    const term = $('terminal');
    if (!term) return;
    const lines = Array.from(term.querySelectorAll('.t-line'));
    const play = () => {
      if (prefersReduced()) {
        lines.forEach((l) => l.classList.add('is-on'));
        return;
      }
      lines.forEach((l, i) => {
        setTimeout(() => l.classList.add('is-on'), 250 + i * 340);
      });
    };
    if (!('IntersectionObserver' in window)) {
      play();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            io.disconnect();
            play();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(term);
  }

  function initCopy() {
    const btn = $('clone-btn');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(CLONE);
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = CLONE;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (_) {}
        document.body.removeChild(ta);
      }
      btn.classList.add('is-copied');
      setTimeout(() => btn.classList.remove('is-copied'), 1200);
    });
  }

  function initMagnetic() {
    if (prefersReduced()) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.querySelectorAll('.magnetic').forEach((el) => {
      let raf = 0;
      el.addEventListener('pointermove', (ev) => {
        const r = el.getBoundingClientRect();
        const dx = Math.max(-6, Math.min(6, (ev.clientX - (r.left + r.width / 2)) * 0.18));
        const dy = Math.max(-6, Math.min(6, (ev.clientY - (r.top + r.height / 2)) * 0.22));
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = `translate(${dx}px, ${dy}px)`;
        });
      });
      el.addEventListener('pointerleave', () => {
        cancelAnimationFrame(raf);
        el.style.transform = '';
      });
    });
  }

  /* ————————————————— AI demo (copilot autopilot) ————————————————— */

  let aiDemoRunning = false;

  function flashHint(html) {
    const el = $('stage-hint');
    const prev = t('hint.' + Math.min(state.mission, 3));
    el.innerHTML = html;
    setTimeout(() => {
      el.innerHTML = t('hint.' + Math.min(state.mission, 3));
    }, 3400);
    void prev;
  }

  async function runAIDemo() {
    if (aiDemoRunning) return;
    aiDemoRunning = true;
    const btn = $('ai-demo-btn');
    if (btn) btn.disabled = true;

    if (!state.nodes.some((n) => n.kind === 'root')) initPlayground();
    const root = state.nodes.find((n) => n.kind === 'root');
    if (!root) {
      aiDemoRunning = false;
      if (btn) btn.disabled = false;
      return;
    }

    // liveness: bail out only if the canvas was reset out from under us
    const demoGen = playgroundGen;
    const rootId = root.id;
    const alive = () => !!nodeById(rootId) && playgroundGen === demoGen;
    const badge = document.createElement('div');
    badge.className = 'copilot-badge';
    canvasEl().appendChild(badge);
    const setTool = (name) => {
      badge.innerHTML = '<span class="dotpulse"></span>CopilotKit · ' + name + '()';
    };
    const cancelled = () => !alive();

    try {
      $('playground').scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' });
      await sleep(500);
      if (cancelled()) return;

      setTool('createBranchFromNode');
      await sleep(600);
      if (cancelled()) return;
      await createBranch(root.id, 'oauth', t('phrase.oauth'), null);
      if (cancelled()) return;
      await sleep(400);

      setTool('createBranchFromNode');
      await sleep(450);
      if (cancelled()) return;
      await createBranch(root.id, 'passkeys', t('phrase.passkeys'), null);
      if (cancelled()) return;
      await sleep(400);

      const a = state.nodes.find((n) => n.topicKey === 'script.oauthTopic');
      const b = state.nodes.find((n) => n.topicKey === 'script.passkeysTopic');
      if (!a || !b) return;

      setTool('mergeChatNodes');
      [a, b].forEach((n) => {
        state.selected.add(n.id);
        if (n.el) n.el.classList.add('is-selected');
      });
      updateMergePopup();
      await sleep(750);
      if (cancelled()) return;

      await mergeNodes([a, b], 'merge.compare', null);
      if (cancelled()) return;

      setTool('appendNodeMessage');
      await sleep(900);
      $('stage-hint').innerHTML = t('hint.demoDone');
    } finally {
      badge.remove();
      if (btn) btn.disabled = false;
      aiDemoRunning = false;
    }
  }

  /* ————————————————— markdown export ————————————————— */

  function exportMarkdown() {
    const lines = ['# ' + t('chrome.workspace'), ''];
    state.nodes.forEach((n) => {
      lines.push('## ' + nodeTopic(n));
      const parents = state.edges
        .filter((e) => e.to === n.id)
        .map((e) => nodeById(e.from))
        .filter(Boolean);
      if (parents.length) {
        lines.push('', '> ' + parents.map(nodeTopic).join(' + '));
      }
      lines.push('', '### Conversation');
      if (!n.messages.length) {
        lines.push('', '- ' + t('chat.empty'));
      }
      n.messages.forEach((m) => {
        const who = m.role === 'user' ? 'You' : 'AI';
        let text = m.raw != null ? m.raw : m.key ? t(m.key) : '';
        text = text.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '$2');
        if (m.quoteKey) {
          const head = `${t('sel.explore')} "${t(m.quoteKey)}"`;
          text = text ? `${head} — ${text}` : head;
        } else if (m.noteKey) {
          text = `${text} (${t(m.noteKey, m.noteVars || {})})`;
        }
        lines.push('', `**${who}**: ${text}`);
      });
      lines.push('');
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'caudalflow-demo.md';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 300);
    flashHint(t('hint.exported'));
  }

  /* ————————————————— boot ————————————————— */

  function bindPlaygroundControls() {
    $('sel-close').addEventListener('click', closeSelPopup);
    $('sel-send').addEventListener('click', submitSelection);
    $('sel-explore').addEventListener('click', submitSelection);
    $('sel-input').addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        submitSelection();
      }
    });

    $('merge-send').addEventListener('click', () => {
      const v = $('merge-input').value.trim();
      if (v) submitMerge(null, v);
    });
    $('merge-input').addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        const v = $('merge-input').value.trim();
        if (v) submitMerge(null, v);
      }
    });
    $('chip-compare').addEventListener('click', () => submitMerge('merge.compare', null));
    $('chip-summarize').addEventListener('click', () => submitMerge('merge.summarize', null));
    $('chip-connections').addEventListener('click', () => submitMerge('merge.connections', null));

    $('zoom-in').addEventListener('click', () => {
      state.userZoomed = true;
      state.zoom = Math.min(1.25, state.zoom + 0.12);
      applyZoom();
    });
    $('zoom-out').addEventListener('click', () => {
      state.userZoomed = true;
      state.zoom = Math.max(0.45, state.zoom - 0.12);
      applyZoom();
    });
    $('zoom-fit').addEventListener('click', () => {
      state.userZoomed = false;
      fitZoom();
    });

    $('reset-btn').addEventListener('click', initPlayground);
    $('replay-link').addEventListener('click', initPlayground);
    $('ai-demo-btn').addEventListener('click', runAIDemo);
    $('export-btn').addEventListener('click', exportMarkdown);
    const demoCta = $('ai-demo-cta');
    if (demoCta) {
      demoCta.addEventListener('click', () => {
        $('playground').scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' });
        setTimeout(runAIDemo, prefersReduced() ? 50 : 550);
      });
    }

    // empty-canvas: drag = marquee multi-select · tap = clear
    canvasEl().addEventListener('pointerdown', (ev) => {
      if (ev.target !== canvasEl() && ev.target !== nodesEl()) return;
      if (ev.button !== undefined && ev.button !== 0) return;
      if (ev.pointerType === 'touch') {
        clearSelection();
        closeSelPopup();
        return;
      }
      const startP = canvasPoint(ev);
      let active = false;
      const box = document.createElement('div');
      box.className = 'marquee';
      box.style.display = 'none';
      canvasEl().appendChild(box);

      const onMove = (e2) => {
        const p = canvasPoint(e2);
        const x = Math.max(0, Math.min(startP.x, p.x));
        const y = Math.max(0, Math.min(startP.y, p.y));
        const w = Math.abs(p.x - startP.x);
        const h = Math.abs(p.y - startP.y);
        if (!active && w + h > 8) {
          active = true;
          clearSelection();
        }
        if (!active) return;
        box.style.display = 'block';
        box.style.left = x + 'px';
        box.style.top = y + 'px';
        box.style.width = w + 'px';
        box.style.height = h + 'px';
        const rect = { x, y, w, h };
        state.nodes.forEach((m) => {
          const hit =
            rect.x < m.x + (m.collapsed ? 160 : m.w || NODE_W) &&
            rect.x + rect.w > m.x &&
            rect.y < m.y + (m.collapsed ? 60 : nodeH(m)) &&
            rect.y + rect.h > m.y;
          if (hit) state.selected.add(m.id);
          if (m.el) m.el.classList.toggle('is-selected', state.selected.has(m.id));
        });
      };
      const finish = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', finish);
        box.classList.add('is-done');
        setTimeout(() => box.remove(), 300);
        if (active) updateMergePopup();
        else {
          clearSelection();
          closeSelPopup();
        }
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerup', finish);
    });

    window.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') {
        closeSelPopup();
        state.nodes.forEach(closeNodePopovers);
      }
    });

    let resizeRaf = 0;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        if (!state.userZoomed) fitZoom();
      });
    });
  }

  function boot() {
    try {
      const storedLang = localStorage.getItem('cf-lang');
      if (storedLang === 'zh' || storedLang === 'en') lang = storedLang;
      else lang = (navigator.language || 'en').toLowerCase().startsWith('zh') ? 'zh' : 'en';
    } catch (_) {
      lang = 'en';
    }

    applyTheme(resolveTheme());
    applyI18n();
    initPlayground();
    bindPlaygroundControls();
    initReveal();
    initTerminal();
    initCopy();
    initMagnetic();

    const langBtn = $('lang-toggle');
    if (langBtn) langBtn.addEventListener('click', () => setLang(lang === 'en' ? 'zh' : 'en'));
    const themeBtn = $('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const next = resolveTheme() === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try { localStorage.setItem('cf-theme', next); } catch (_) {}
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
