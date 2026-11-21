# AGENTS.md

自托管个人首页（Firefly）：把常用网站收录为书签集中展示，曲线解决跨浏览器书签同步。Next.js 16（App Router）+ React 19 + TypeScript，配置以 YAML 存储，支持 Upstash Redis、WebDAV 与本地磁盘三种后端。界面文案、日志、注释均为中文。

## 常用命令

| 目的     | 命令                                            | 说明                                                                    |
| -------- | ----------------------------------------------- | ----------------------------------------------------------------------- |
| 安装依赖 | `npm install`                                   | 首次克隆或依赖变更后；CI 用 `npm ci`（需 lockfile 同步）                |
| 开发     | `npm run dev`                                   | Next dev + Turbopack，默认 http://localhost:3000                        |
| 构建     | `npm run build`                                 | 先 `npm run gen-icons` 生成图标索引，再 `next build`（standalone 产物） |
| 启动产物 | `npm start`                                     | 运行构建结果                                                            |
| 测试     | `npm test`                                      | `node --test --experimental-strip-types`，直接执行 `*.test.ts`          |
| 单测文件 | `node --test --experimental-strip-types <file>` | 例：`infrastructure/auth.test.ts`                                       |
| 类型检查 | `npx tsc --noEmit`                              | strict 模式                                                             |
| Lint     | `npm run lint`                                  | eslint flat config（eslint-config-next core-web-vitals + typescript）   |
| 格式化   | `npx prettier --write <path>`                   | 配置见 `.prettierrc.js`（120 列、单引号、es5 尾逗号、单参箭头省略括号） |
| 图标索引 | `npm run gen-icons`                             | 生成 `public/assets/icons.json`（已 gitignore）                         |

本地开发环境变量放在 `.env.local`（已存在、已 gitignore）：

```bash
FIREFLY_DISABLE_LOGIN=false
FIREFLY_USERNAME=admin
FIREFLY_PASSWORD=admin
DISK_PATH=./.data
```

数据文件为 `./.data/bookmarks.yml` 与 `./.data/settings.yml`（`.data` 已 gitignore）。Node 版本：Docker 与 CI 使用 Node 26（`node:26-alpine` / `26.x`）。

注意：若 `.env.local` 同时配置了 `UPSTASH_REDIS_REST_URL/TOKEN`（或 `KV_REST_API_*`），Redis 的优先级高于 `DISK_PATH`，本地改 `.data/*.yml` 不会影响页面渲染；需要走磁盘数据时临时移走相关变量。

## 目录结构

```
app/                路由与页面
  page.tsx          首页 RSC：取 setting/weather/bookmarks 后交给 Home.tsx
  Home.tsx          'use client' 首页壳：SettingProvider + SWR fallback
  login/            登录页（useActionState 提交 Server Action）
  settings/         设置页：bookmark、weather、search、ui、about
  api/              weather/、favicon/、icon/ 三个 Route Handler
  components/       首页业务组件：bookmark、filter、clock、weather-icons
actions/            服务端业务逻辑（bookmark/setting/weather/auth），Joi 校验 + storage 读写
infrastructure/     configuration（环境变量校验）、auth（token）、storage（disk/webdav/upstash-redis）、request（SWR fetcher）
hooks/              客户端 hooks（SWR 封装）与 SettingContext
components/         通用 UI：Table、Affix、Button、Checkbox、Spinner、RemoteIcon、FaviconIcon、IconSelect（统一由 index.ts 导出）
typings/            全局类型声明（*.d.ts）
scripts/            gen-icons（图标索引）、migrate-to-upstash-redis（存储迁移）、Docker 构建用的 next.build.config.ts
proxy.ts            Next 16 的 middleware（拦截 /settings/:path*）
```

## 架构要点

### 数据流

- 读：RSC 页面直接调用 `actions/*`（`bookmark.list`、`setting.get`、`weather.fromSetting`），把结果作为 props 传给客户端组件。首页用 `SettingProvider` 下发设置，天气通过 `SWRConfig` 的 fallback 注入，随后由 `useWeather` 每小时刷新 `/api/weather`。
- 写：没有 REST 写接口。设置页在 `page.tsx` 内定义 `'use server'` 函数（闭包捕获当前配置）作为 prop 传给表单，保存时整份配置覆盖写入 YAML。
- 设置子页（`/settings/search`、`/settings/ui`、`/settings/weather`）声明了 `export const dynamic = 'force-dynamic'`，避免构建期读取存储后把配置固化进静态页；新增会读取存储的设置页时同样要加。
- API 路由有三个：`/api/weather`（读设置 → 查天气）、`/api/favicon?host=<url>`（favicon.im → 自抓 → 地球图标）、`/api/icon/[set]/[name]`（按需拼装 simple-icons 的 SVG，响应带一年强缓存，未知图标返回地球）。

### 存储

- 接口 `SettingStorage`（`typings/storage.d.ts`）只有 `read` / `write`，数据格式固定为 YAML。
- 后端选择顺序：`KV_REST_API_*`（Vercel 的 Upstash 集成）或 `UPSTASH_REDIS_REST_*` → `WEBDAV_HOST` → `DISK_PATH`，见 `configuration.ts` 的 `resolveStorage()`。
- `infrastructure/storage/index.ts` 在**模块加载时**按配置创建单例：环境变量只在进程启动时读取一次，修改后必须重启；测试中请直接 `new DiskStorage(...)`，不要走单例。
- 新增配置文件：先 Joi 校验，再 `storage.write('xxx.yml', value)`；读取时对 `null` 给默认值（参考 `actions/setting.ts` 的 `DEFAULTS` 与 `get()` 的浅合并）。
- WebDAV 后端依据 404/409 判断文件或目录不存在，目录缺失时自动 `createDirectory` 后重试写入（见 `webdav.ts`）。
- Upstash Redis 后端把每个 YAML 文件整体存成一个字符串键（`<prefix><name>`，默认前缀 `firefly:`），并关闭了 SDK 的自动 JSON 反序列化；从旧后端迁移用 `scripts/migrate-to-upstash-redis.ts`，只读源、只写目标，不删除源数据。

### 认证与访问控制

- 登录态是 httpOnly Cookie `firefly-token`，值为 `base64(payload)|base64(HMAC-SHA256)`，`payload = 用户名|签发时间|过期时间`；密钥由 `FIREFLY_PASSWORD` 派生，用 `crypto.subtle` 签名/校验。
- 登录、登出是 `actions/auth.ts` 的 Server Action；Cookie 只能在 Server Action 中写入（`updateToken`）。
- `proxy.ts`（matcher `'/settings/:path*'`）在未登录时重定向到 `/login?redirectTo=...`；`FIREFLY_DISABLE_LOGIN=true` 时跳过校验，并隐藏登录/私密书签相关 UI。
- 私密书签的过滤发生在服务端 `actions/bookmark.list(anonymous)`，不要依赖前端隐藏。
- 新增受保护路由要同时改 `proxy.ts` 的 matcher 和页面内的登录判断。

### 配置与环境变量

| 变量                                                  | 说明                                                                                                                                               |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FIREFLY_TITLE`                                       | 页面标题，默认 `Firefly`                                                                                                                           |
| `FIREFLY_USERNAME`                                    | 登录用户名，未禁用登录时必填                                                                                                                       |
| `FIREFLY_PASSWORD`                                    | 登录密码，同时作为 token 签名密钥来源，未禁用登录时必填                                                                                            |
| `FIREFLY_DISABLE_LOGIN`                               | `true` 时关闭登录与私密书签（内网部署常用）                                                                                                        |
| `FIREFLY_EXPIRE`                                      | 登录有效期（秒），默认 `864000`（10 天）                                                                                                           |
| `DISK_PATH`                                           | 磁盘存储目录，Docker 镜像默认 `/app/data`                                                                                                          |
| `WEBDAV_HOST` 等                                      | 设置 `WEBDAV_HOST` 即切换为 WebDAV 存储，配套 `WEBDAV_USERNAME` / `WEBDAV_PASSWORD` / `WEBDAV_AUTH_TYPE`（Digest 或 Password）/ `WEBDAV_DIRECTORY` |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN`               | Vercel 的 Upstash 集成自动注入，存在时优先使用 Upstash Redis 存储                                                                                  |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | 手动配置 Upstash（非 Vercel 集成）时使用；与上面的 `KV_*` 二选一                                                                                   |
| `REDIS_KEY_PREFIX`                                    | Redis 键前缀，默认 `firefly:`（多个实例共用同一数据库时用来区分）                                                                                  |

统一由 `infrastructure/configuration.ts` 用 Joi 校验并单例缓存，缺失必填项会直接抛错（构建期也需要可用的环境变量，见「构建与部署」）。

## 编码约定

- TypeScript `strict`；路径别名 `@/*` 指向仓库根目录。
- 全局类型放 `typings/*.d.ts`（`IBookmark`、`ISetting`、`IToken` 等），直接使用，**不要 import**。
- 服务端逻辑放 `actions/`（Joi schema + storage）；需要浏览器交互的组件标 `'use client'`，页面本身保持 RSC。
- 通用 UI 放 `components/` 并从 `components/index.ts` 统一导出；页面专属组件就近放在 `app/components/` 或 `app/settings/<模块>/`。
- 样式一律 CSS Modules（`*.module.css`）+ `app/globals.css` 的全局工具类（`page-container`、`no-select`、`form-group`），不引入 UI 框架；表格用 `components/table`（封装 rc-table），提示用 react-toastify，类名合并用 classnames。
- 依赖职责：`joi` 校验、`yaml` 序列化、`swr` 客户端取数、`date-fns`/`date-fns-tz` 时间处理、`webdav` 与 `@upstash/redis` 存储、`@mdi/js` + `@mdi/react` 渲染界面自身的图标（**不要用于书签图标**）、`simple-icons` 提供书签品牌图标、`node-html-parser` 解析 favicon。
- 组件用函数组件，文件名与组件名一致；hooks 以 `use` 开头。
- RSC 中直接调用 `Date.now()` / `new Date()` 会触发 `react-hooks/purity` 规则，按现有写法用 `// eslint-disable-next-line react-hooks/purity` 局部豁免，不要全局关闭规则（`react-hooks/immutability` 同理）。
- 新增用户可见文案、日志与注释保持中文。

## 测试

- 使用 `node:test` + `node:assert`，测试文件与源文件同目录，命名 `*.test.ts`，且 import 时带 `.ts` 后缀（`--experimental-strip-types` 直接执行 TS，无需编译）。
- 现有测试：`infrastructure/auth.test.ts`（token 签发/校验）、`infrastructure/storage/storage.test.ts`（磁盘 + 进程内 `webdav-server`）、`actions/weather.test.ts`（**真实请求腾讯天气接口，需要外网**）。Upstash Redis 后端没有自动化测试，避免依赖线上服务。
- 测试会临时改写 `process.env`，请在 `before`/`after` 中恢复原值。
- 提交前至少执行 `npm test`、`npm run lint`、`npx tsc --noEmit`。

## 构建与部署

- `next.config.ts`：仅在非 Vercel 环境启用 `output: 'standalone'`（规避 Next 16.3 的 `nft.json` 构建回归）。
- `Dockerfile`：`node:26-alpine` 多阶段构建，用 `scripts/next.build.config.ts` 覆盖 `next.config.ts`，产物以 `node server.js` 运行；数据目录 `/app/data`，容器用户/组 `1001`。
- 构建期必须提供 `FIREFLY_DISABLE_LOGIN=true` 与 `DISK_PATH`，否则配置校验/数据初始化会失败（Dockerfile 与 CI 已设置）。
- Vercel 部署使用 Upstash Redis（集成注入 `KV_REST_API_URL/TOKEN`），Function Region 为 `hkg1`（香港）；Upstash 数据库应选东京 `ap-northeast-1`，与香港延迟约 30–50 ms。
- GitHub Actions（仅 `master` 的 push，`.github/workflows/build.yml`）：先由 `verify` job 跑 `npm ci` + `tsc --noEmit` + lint + test，通过后并行执行两个部署 job——`deploy-docker` 构建并推送 Docker Hub `knives/firefly:latest`（层缓存走 GitHub Actions cache），`deploy-vercel` 本地构建预检后用 `amondnet/vercel-action` 部署生产。项目**没有**启用 Vercel 的 Git 集成，Actions 是唯一部署通道；`concurrency` 会让新推送取消上一次未完成的流水线。

## 注意事项 / 已知问题

- 书签图标分两种，只有这两个来源：
  - `icon` 为空：走 `/api/favicon` 自动抓取站点图标。
  - `icon` 为 `simple-icons:<slug>`：走 `/api/icon/simple-icons/<slug>`。**格式固定为带图标集前缀**，Joi 校验规则在 `actions/bookmark.ts`；不要再引入 mdi 等其他图标集。
  - 选择器的搜索索引 `public/assets/icons.json`（约 3470 条，180KB+，gzip 后约 50KB）由 `npm run gen-icons` 生成且被 gitignore，未执行时选择器为空——首次开发或 `npm install` 后记得运行；SVG 路径不落盘，由 `/api/icon` 按需返回。
  - 图标统一用 mask + `currentColor` 渲染（`components/icon/RemoteIcon.tsx`），跟随文字颜色与暗色主题；不要再回到 `<img>` + `filter` 反色的方案。
  - 图标格式迁移已完成，一次性脚本已删除；数据里出现无法识别的 `icon` 时直接清空即可，会回退到自动抓取。
- `/api/favicon` 的获取顺序是 **favicon.im → 直接抓取目标站 → 地球图标**。第三方返回 404 或默认「f」头像时回退自抓；内网地址不发起任何外部请求，直接返回地球。安全限制：只允许 http/https、解析 DNS 后拒绝私有/回环网段、逐跳校验重定向、第三方重定向只允许 `favicon.im` 域、两段超时分别为 3 秒和 5 秒、HTML 与图标都有大小上限。修改时不要放宽这些限制。
- 天气数据来自 `https://wis.qq.com/weather/common`，`location` 为空格分隔的「省 市 县」（如 `北京 北京市 昌平区`）。接口失败时 `actions/weather.ts` 直接抛错，而首页 `app/page.tsx` 未做兜底，会导致整页报错；改动时注意异常处理。
- `typescript` 停在 **6.0.x**：TypeScript 7（`7.x`）改用 Go 原生编译器，`typescript` 包只导出 `version` 与 `unstable/*`，旧的 JS 编译器 API 已移除；而 `eslint-config-next` 依赖的 `typescript-eslint`（8.x）peer 要求 `typescript >=4.8.4 <6.1.0`。升到 7 会导致 `npm run lint` 无法解析类型，需等 typescript-eslint 支持后再升。
- `eslint` 为 **10.x**，但 `eslint-config-next@16.4.x` 内部依赖的 `eslint-plugin-import` / `jsx-a11y` / `react` 的 peer 仍只声明到 `^9`，`npm install` / `npm ci` 会出现 `ERESOLVE overriding peer dependency` 警告（不阻断安装，实测 lint 正常）。若日后规则异常，可回退 `eslint@9.39.5`（npm 的 maintenance 分支）。
- 依赖变更后需同步 `package-lock.json`（CI 用 `npm ci`），并重新执行 `npm run gen-icons`、`npm test`、`npm run lint`、`npx tsc --noEmit`。
