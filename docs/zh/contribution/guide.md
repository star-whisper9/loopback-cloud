---
title: 文档贡献指南
description: 贡献规则、Frontmatter 字段与 Markdown 扩展语法完整参考
order: 1
created: 2026-07-29
updated: 2026-07-29
author:
  - name: 星语
    email: star@sotis.space
    url: https://github.com/star-whisper9
---

环回云文档是一份 **社区驱动** 的家里云（Home-Lab）知识库。本页是面向贡献者的完整参考，涵盖三部分：贡献规则、Frontmatter 字段全解、Markdown 与扩展语法全解。

写作前请通读本页——本站文档构建管线对 Frontmatter 与语法有明确约束，不符合约束的内容会在构建时报错或被静默忽略。

## 贡献规则

### 内容范围

我们接受与家里云相关的 **真实、可复现** 的实践内容，例如：

- 操作系统安装与配置（Windows / Linux / BSD）
- 虚拟化方案（PVE、ESXi、Hyper-V 等）
- 网络规划、内网穿透与防火墙
- 存储方案与数据备份
- 硬件选购、排障与维护

谢绝：未经验证的纯转发内容、与家里云无关的推广、大段未标注的 AI 生成内容。

### 目录与文件

- 一个分类对应语言目录下的一个子目录，目录内放 `_category.md` 声明分类标题与排序
- 文章文件名为小写短横线命名（kebab-case），如 `getting-started.md`
- **不要把文章命名为 `index.md`**——子目录中的 `index.md` 会被构建直接忽略
- 不想出现在侧边栏导航中的文章，设置 `navIgnore: true`（页面仍可通过 URL 访问）

### 写作规范

- 页面标题由 Frontmatter 的 `title` 生成，正文从二级标题（`##`）开始，**不要写一级标题**
- 二级 / 三级标题会自动生成锚点并收录进右侧大纲，措辞请简短、适合做目录条目
- 代码块必须标注语言，否则没有语法高亮
- 可能损坏软硬件环境的操作（格式化磁盘、刷写固件、改动网络配置等）必须配 `:::warning` 提示
- 图片请携带有意义的替代文本：`![替代文本](图片地址)`

### 翻译规范

- 英文版（`docs/en/`）为可选项；缺失时英文读者自动看到中文版，并显示回退提示
- 英文目录结构与中文保持一致，构建会按条目逐一回退
- 译文必须如实填写 `translator` 字段，标明机器翻译 / AI 翻译 / 人工翻译 / 混合

### 审核与免责

- 我们对贡献内容仅做简单审核，不保证正确性与时效性
- 环回云不对读者因阅读文档造成的损失负责——这条对贡献者本人同样适用

## Frontmatter 全解

完整示例：

```yaml
---
title: 快速开始 # 必填，页面标题
description: 五分钟上手环回云 # 可选，显示在标题下方的简介
order: 1 # 可选，侧边栏排序，越小越靠前，默认 0
created: 2026-07-29 13:16:13 +8 # 可选，创建时间
updated: 2026-07-29 # 可选，最后更新时间
author: # 可选，作者列表
  - name: 星语 #   必填，超过 24 字符会截断显示
    email: star@sotis.space #   可选，渲染为邮件图标
    url: https://github.com/star-whisper9 # 可选，作者名渲染为链接
translator: # 可选，译文信息，通常由英文版填写
  type: mix #   必填，machine | llm | human | mix
  model: step-3.7-flash #   可选，type 为 llm / mix 时建议填写
  human: #   可选，type 为 human / mix 时建议填写
    - 星语
navIgnore: false # 可选，true 时不出现在侧边栏导航
---
```

### 字段一览

| 字段          | 类型     | 必填 | 说明                                             |
| ------------- | -------- | ---- | ------------------------------------------------ |
| `title`       | string   | 是   | 页面标题，渲染为 h1                              |
| `description` | string   | 否   | 简介，显示在标题下方                             |
| `order`       | number   | 否   | 侧边栏排序，越小越靠前，默认 0；相同时按路径排序 |
| `created`     | datetime | 否   | 创建时间，见下文格式说明                         |
| `updated`     | datetime | 否   | 更新时间，格式同上                               |
| `author`      | array    | 否   | 作者列表，见下文                                 |
| `translator`  | object   | 否   | 翻译信息，生成译文横幅                           |
| `navIgnore`   | boolean  | 否   | 为 `true` 时不出现在侧边栏                       |

### 时间格式

`created` / `updated` 接受以下写法，构建时统一归一化为 ISO 8601（UTC）：

| 写法             | 示例                                                |
| ---------------- | --------------------------------------------------- |
| ISO 8601         | `2026-07-29T13:16:13Z`、`2026-07-29T13:16:13+08:00` |
| 日期时间 + 时区  | `2026-07-29 13:16:13 +8`                            |
| 日期时间，无时区 | `2026-07-29 13:16:13`（按 UTC 处理）                |
| 省略分 / 秒      | `2026-07-29 13:16`、`2026-07-29 13`                 |
| 仅日期           | `2026-07-29`（按 UTC 0 点处理）                     |

时区支持 `+8`、`+08`、`+0800`、`+08:00`、`Z` 等写法；展示时按访问者所在时区渲染。

:::tip[建议]
显式写出时区（如 `+8`）。不加引号的 YAML 时间值会按 YAML 1.1 时间戳解析，无时区时按 UTC 而非本地时间处理——期望本地时间语义时务必显式标注时区。
:::

### 作者与译者

作者显示规则：

- `name` 必填，超过 24 字符会截断显示
- `url` 存在时作者名渲染为外链；`email` 存在时渲染为邮件图标

译者 `type` 决定页面译文横幅的文案：

| type      | 含义               | 建议补充                |
| --------- | ------------------ | ----------------------- |
| `machine` | 机器翻译           | —                       |
| `llm`     | AI 模型翻译        | `model`                 |
| `human`   | 人工翻译           | `human` 名单            |
| `mix`     | AI 翻译 + 人工审校 | `model` 与 `human` 名单 |

## Markdown 与扩展语法

### 基础语法（CommonMark + GFM）

支持标准 Markdown 与 GitHub Flavored Markdown 扩展：

- 文本样式：**粗体**、_斜体_、~~删除线~~、`行内代码`
- 链接与图片：`[链接文本](地址)`、`![替代文本](图片地址)`
- 有序 / 无序列表、引用块、分割线
- 表格（GFM）与任务列表（GFM）

任务列表示例：

- [x] 安装系统
- [ ] 配置网络

:::note
行内 HTML 会原样透传渲染，请谨慎使用——它绕过了构建管线的样式与转义。
:::

### 代码块

围栏代码块经 Shiki 以 `github-dark` 主题高亮，**必须标注语言**：

```bash
ssh root@127.0.0.1
```

### 终端演示块（Terminal Replay）

使用 `terminal` 语言可以展示带命令提示符和输出的动态终端记录。它只回放预先写入文档的内容，不会在浏览器中执行命令：

```terminal title="检查 Docker 服务" speed="normal"
$ docker compose up -d
[+] Running 3/3
 ✔ Network app_default  Created
 ✔ Container database  Started
 ✔ Container web        Started

$ docker ps
CONTAINER ID   IMAGE     STATUS
a1b2c3         nginx     Up 2 minutes
```

终端块支持以下可选属性：

| 属性 | 可选值 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | 任意文本 | `终端演示` | 顶部标题栏显示的名称 |
| `autoplay` | `visible` / `load` / `manual` | `visible` | 播放触发方式；`visible` 在滚动到可视区域时播放 |
| `speed` | `fast` / `normal` / `slow` | `normal` | 命令打字和输出回放速度 |
| `loop` | `true` / `false` | `false` | 播放完成后是否循环 |

书写规则：

- 以 `$`、`#`、`%`、`>` 或常见 Shell 提示符开头的行会被识别为命令
- 命令后的连续行会被识别为输出，空行会被保留
- 复制按钮只复制命令内容，不包含提示符和输出
- 播放器提供播放 / 暂停、重播、显示全部和复制命令操作
- 用户开启“减少动态效果”后，终端会直接显示完整内容
- 较长的演示建议使用 `autoplay="manual"`，避免打断读者阅读

### 标题锚点与大纲

- 二级、三级标题自动生成 `id` 锚点，并收录进页面右侧大纲
- 中文标题同样支持锚点；重复文案的标题会自动追加数字后缀

### 提示框（Callout）

四种类型，默认标题随界面语言切换，也可用 `[标题]` 自定义：

| 指令           | 默认标题 | 用途               |
| -------------- | -------- | ------------------ |
| `:::note`      | 注释     | 补充说明           |
| `:::warning`   | 警告     | 可能造成损害的操作 |
| `:::tip`       | 提示     | 可选的技巧         |
| `:::important` | 重要     | 必须知晓的信息     |

写法与渲染效果：

```md
:::warning[高危操作]
这条命令会清空磁盘，执行前再三确认。
:::
```

:::warning[高危操作]
这条命令会清空磁盘，执行前再三确认。
:::

### 折叠块（Details）

```md
:::details[展开查看配置文件示例]
折叠内容，支持任意 Markdown。
:::
```

:::details[展开查看配置文件示例]
折叠内容，支持任意 Markdown。
:::

### 代码标签页（Code Tabs）

外层四个冒号、内层三个冒号，`label` 为标签页标题，**最多 3 个标签页**：

````md
::::code-tabs

:::tab{label="pnpm"}

```bash
pnpm add loopback-cloud
```

:::

:::tab{label="npm"}

```bash
npm i loopback-cloud
```

:::

::::
````

渲染效果：

::::code-tabs

:::tab{label="pnpm"}

```bash
pnpm add loopback-cloud
```

:::

:::tab{label="npm"}

```bash
npm i loopback-cloud
```

:::

::::

### 嵌套与限制

- 提示框、折叠块内部可嵌套普通 Markdown 与其他指令（如 details 内放 callout）
- 代码标签页内只能放 `:::tab`，标签页内不能再嵌套指令容器
- 未识别的指令名不会渲染为特殊样式，构建也不会报错——请以本页列出的指令为准
