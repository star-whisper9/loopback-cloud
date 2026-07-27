---
title: Quick Start
order: 1
description: Get going with Loopback Cloud in five minutes
---

# Quick Start

## Install

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

## Configuration

:::details[Expand for an example config]
```toml
[loopback]
addr = "127.0.0.1"
```
:::

:::warning
Do not change `addr` to a physical NIC, or the "absolutely secure" claim breaks.
:::
