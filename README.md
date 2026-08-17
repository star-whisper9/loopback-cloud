# Loopback Cloud（环回云）

环回云是一个运行在 `127.0.0.1` 上的讽刺性“云计算”演示项目。它可以在浏览器中创建虚构的本地实例，查看模拟速度测试和防火墙配置；当前没有后端服务，也不会创建真实的云资源。

线上站点：<https://loopback.f1a.me/>

## 项目状态

- React Router v8 Framework Mode，SPA 模式（`ssr: false`）
- TypeScript、HeroUI、Tailwind CSS、Motion
- 所有实例数据保存在浏览器 `localStorage`
- 文档中心位于 `/docs/*`，中文为基准语言，英文按文章逐条回退
- `/console` 是本地模拟控制台，不代表真实云服务

## 本地运行

环境要求：Node.js 24 或更高版本。

```bash
npm ci
npm run dev
```

开发服务器默认地址为 `http://localhost:5173`。

常用命令：

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动开发服务器和热更新 |
| `npm run build:docs` | 重新生成文档数据 |
| `npm run typecheck` | 生成路由类型并检查 TypeScript |
| `npm test` | 执行测试 |
| `npm run build` | 生成生产构建 |

## 贡献

欢迎提交文档、翻译、错误修复和功能改进。贡献前请先阅读[贡献文档分类](https://loopback.f1a.me/docs/contribution)：

- [贡献规范](https://loopback.f1a.me/docs/contribution/contributing)：贡献范围、分支和 Pull Request 工作流、审阅标准
- [文档格式与语法参考](https://loopback.f1a.me/docs/contribution/guide)：目录、Frontmatter、Markdown 扩展和终端回放

### 快速规范

- 文档先写入 `docs/zh/`；英文版本放在结构对应的 `docs/en/` 中。
- 文档内容应真实、可复现，并写明系统、软件版本和必要前置条件。
- 不提交密码、令牌、私钥、个人信息或未经验证的整段转载。
- 可能破坏系统、磁盘、网络或数据的操作必须写明风险、备份和恢复方法，并使用 `:::warning`。
- 代码块必须标注语言；图片必须提供有意义的替代文本。
- 修改后至少运行 `npm run typecheck`、`npm test` 和 `npm run build`。
- `app/docs/.generated/docs.ts` 是自动生成文件，不要手动编辑。

## 许可证

- 项目自有源代码、配置、脚本和工作流（不含根目录 `components/` 中的上游 UI 组件）使用 [GNU GPL v3.0 或更高版本](LICENSE)。
- `README.md`、`docs/` 和项目自有文档素材使用 [CC BY-SA 4.0](LICENSE-DOCS)。转载或改编时请署名、标注修改，并以相同许可发布改编内容。
- 根目录 `components/` 包含来自 shadcn/ui、Aceternity UI 等上游来源的组件。该目录不纳入本项目的统一许可证声明，使用和修改时必须保留并遵守对应上游许可证。
- 第三方依赖、字体、图标和图片继续遵守各自许可证。

完整的文件范围说明见 [`LICENSE-SCOPE.md`](LICENSE-SCOPE.md)。

贡献者保留原创贡献的版权。提交 Pull Request 即表示你有权提交相关内容，并同意它按照所属内容类型的许可证发布；项目目前不要求单独签署 CLA。

## 免责声明

项目及文档仅供学习、演示和社区交流。执行涉及系统、磁盘、网络、固件或数据的操作前，请自行确认目标、备份数据并承担风险。
