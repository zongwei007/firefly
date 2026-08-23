# AGENTS.md

自托管个人首页（Firefly），用于集中管理和显示书签链接。Next.js 16（App Router）+ React 19 + TypeScript，配置存储支持本地磁盘 YAML 与 WebDAV。

## 常用命令

- 开发：`npm run dev`（Turbopack）
- 构建：`npm run build`（先执行 `npm run copy-icon` 生成图标资源，再 `next build`）
- 启动：`npm start`
- 测试：`npm test`（node 内置测试，`--experimental-strip-types`，直接运行 `.test.ts`）
- 类型检查：`npx tsc --noEmit`
- Lint：`npm run lint`（eslint，eslint-config-next + typescript）
- 格式化：prettier（`.prettierrc.js`：printWidth 120、singleQuote、jsxBracketSameLine）

## 架构约定

```
app/            路由与页面：page/layout/login/settings 及 api/（favicon、weather）
actions/        服务端业务逻辑（bookmark/setting/weather/auth），供 RSC 与 Server Action 调用
infrastructure/ 基础设施：configuration（环境变量校验）、auth（token）、storage、request
hooks/          客户端数据 hooks（SWR 封装）、SettingContext
components/     通用 UI 组件（Table/Affix/Button/Icon/IconSelect/Spinner 等）
typings/        全局类型声明（*.d.ts），无需 import 即可使用
scripts/        图标复制脚本与 Docker 构建用的 next.config
```

- 全局类型（`IBookmark`、`ISetting`、`IToken` 等）放在 `typings/*.d.ts`，直接使用，不要用 import 引入。
- 路径别名：`@/*` 指向项目根目录。
- 新增业务能力：服务端逻辑放 `actions/`（Joi schema 校验 + storage 读写），客户端数据获取用 `hooks/` 封装 SWR。
- 测试文件与源文件同目录，命名 `*.test.ts`，使用 `node:test` + `node:assert`。
- 样式使用 CSS Modules（`*.module.css`）。

## 注意事项

- 构建前必须运行 `npm run copy-icon`（`public/assets/` 下的 mdi / simple-icons / icon-meta.json 由此生成，已被 gitignore），否则图标选择器无数据。
- 配置由环境变量驱动（FIREFLY_*、WEBDAV_*、DISK_PATH），通过 `infrastructure/configuration.ts` 的 Joi 校验并单例缓存；修改后需重启服务。
- 认证 token 使用 HMAC-SHA256，密钥派生自 `FIREFLY_PASSWORD`；`FIREFLY_DISABLE_LOGIN=true` 时关闭登录与私密书签功能。
- `/settings/*` 受 `proxy.ts`（middleware）保护，未登录访问会重定向到登录页。
- `hooks/bookmark.ts` 的 `useBookmarks` 引用了不存在的 `/api/bookmarks` 端点且无调用方，属遗留死代码，改动时勿依赖。
- 依赖变更后运行 `npm run copy-icon` 与 `npm test`、`npm run lint`、`npx tsc --noEmit` 验证。
