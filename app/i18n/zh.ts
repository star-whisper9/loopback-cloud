const zh = {
  brand: "环回云",
  brandTagline: "Loopback Cloud",
  nav: {
    product: "产品",
    pricing: "价格",
    docs: "文档",
    cta: "免费开通",
  },
  hero: {
    badge: "127.0.0.1 ⌁ 即云即用",
    title: "0 延迟，0 成本，绝对安全",
    subtitle: "全球唯一数据绝不出户的量子级云服务。",
    ctaPrimary: "立即免费开通",
    ctaSecondary: "查看文档",
    bannerFrames: {
      leftTitle: "LOCALHOST",
      leftSubtitle: "127.0.0.1",
      kw1: "0$/MONTH",
      kw2: "ANTI DDoS",
      kw3: "LOW PING",
      kw4: "HIGH SPEED",
    },
  },
  sellingPoints: {
    sectionTitle: "为什么选择环回云",
    items: [
      { title: "无限 Tbps 军工级 DDoS 防御", principle: "我们只监听 127.0.0.1，公网甚至都找不到 IP 在哪里，直接免疫。" },
      { title: "0.0001ms 极速延迟", principle: "数据直接走主板 Bus，速度取决于 RAM 频率。" },
      { title: "Zero-Trust 物理隔离级安全", principle: "只要把网线拔掉，数据就是全宇宙最安全的。" },
      { title: "100% SLA 保障", principle: "只要你不关机，我们的云就永不停机。" },
      { title: "弹性硬件，至多超高级硬件配置", principle: "你想分多少核心多少内存就分多少，最多可以全要。" },
    ],
  },
  devQuotes: {
    sectionTitle: "开发者们在说",
    quotes: [
      { name: "匿名独立开发者", role: "完全虚构的前员工", text: "自从用 Loopback，我数据线再没被任何外国情报机构偷看过。" },
      { name: "star-whisper9", role: "项目主理人", text: "我们公司的核心机房就在我卧室，5G 都比不上。" },
      { name: "赵某丰", role: "某不存在公司的 CTO", text: "迁移到 Loopback 之后，运维团队从 12 人减到 0 人（因为我就是运维）。" },
      { name: "Satoshi Who", role: "假名加密爱好者", text: "区块链的速度终于被本地循环了，每次都是 0 确认。" },
      { name: "Tom 从厨房节点", role: "唯一邻居", text: "我把冰箱接上后，本地云真的有了冷备——零下 18°C。" },
      { name: "猫先生", role: "另一只猫", text: "我们家路由器一闪绿光，猫就以为云在出 bug。" },
    ],
  },
  pricing: {
    sectionTitle: "适合你的方案",
    subtitle: "你正在用你自己的电脑，所以两个方案都是 0 元。",
    community: {
      name: "社区版",
      tag: "Loopback Community",
      price: "￥0",
      priceNote: "终身免费",
      cta: "免费开通",
      rows: [
        "CPU 核心 · 共享你的物理 CPU",
        "内存 · 你的物理内存剩余量",
        "带宽 · 无限 Mbps（取决于网线）",
        "防御力 · 抵御全宇宙攻击",
        "数据中心 · 本地 卧室机房-01",
      ],
    },
    enterprise: {
      name: "企业尊享版",
      tag: "Loopback Enterprise",
      price: "￥0.00",
      priceNote: "终身免费（电费自理）",
      cta: "立即免费开通",
      popularBadge: "MOST POPULAR",
      rows: [
        "CPU 核心 · 独占你的物理 CPU 全核",
        "内存 · 占用你全部的 64GB",
        "带宽 · PCIe 4.0 内部总线级",
        "防御力 · 防核弹打击（只要你家没被炸）",
        "数据中心 · 客厅路由器-02 / 厨房冰箱-03",
      ],
    },
  },
  faq: {
    sectionTitle: "常见问题（其实是常见反问）",
    items: [
      { q: "数据备份在哪？", a: "就在你电脑硬盘上，比 S3 安全 1 个网络距离。" },
      { q: "支持水平扩展吗？", a: "支持，把隔壁电脑插上同一根网线即可。" },
      { q: "你们怎么保证 100% SLA？", a: "你不能关机，也不能停电，也不能停电后再关机，逻辑闭环。" },
      { q: "出故障了联系谁？", a: "在镜子前使劲盯自己，运维就会出现的。" },
      { q: "数据合规吗？", a: "数据都在你自己房间里，最大风险是你妈进来打扫卫生。" },
      { q: "能跑 Kubernetes 吗？", a: "能，但我们强烈建议跑 k3s，毕竟你电脑只有 8 核。" },
    ],
  },
  cta: {
    title: "准备好了吗？",
    subtitle: "一行命令，云就在你脚下。",
    button: "立即免费开通",
  },
  footer: {
    slogan: "0延迟，0成本，绝对安全——你脚下的云。",
    disclaimer1: "本服务所有节点均运行在您自己的电脑上。Loopback Cloud 不对您因开机时间过长导致的电费增加承担任何责任。",
    disclaimer2: "HCP 备 2026-0000001 号，本地保留所有权利。",
    links: { about: "关于", blog: "博客", status: "状态" },
  },
  lang: {
    zh: "中文",
    en: "English",
  },
} as const;

export default zh;
