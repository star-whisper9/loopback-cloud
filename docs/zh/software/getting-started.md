---
title: 快速开始
order: 1
description: 五分钟上手环回云
---

## 安装

::::code-tabs

:::tab{label="pnpm" lang="bash"}
```bash
pnpm add loopback-cloud
```
:::

:::tab{label="npm" lang="bash"}
```bash
npm i loopback-cloud
```
:::

::::

## 配置

:::details[展开查看配置文件示例]
```toml
[loopback]
addr = "127.0.0.1"
```
:::

:::warning
不要把 `addr` 改成本机物理网卡地址，否则"绝对安全"卖点会失效。
:::
