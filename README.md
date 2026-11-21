[![Build](https://github.com/zongwei007/firefly/actions/workflows/build.yml/badge.svg)](https://github.com/zongwei007/firefly/actions/workflows/build.yml)

Firefly 是一个自托管的个人首页，用于将常用网站收录为书签链接集中管理和显示，曲线解决跨浏览器的书签同步问题

## 功能

- 内置分类编辑器和书签编辑器
- 支持显示配置地点的天气信息
- 支持将书签置顶为常用书签
- 支持将书签设置为私密书签，仅登录后显示
- 支持书签搜索
- 支持为书签指定图标（内置 [simple-icons](https://simpleicons.org/) 图标库），未指定时自动抓取网站图标
- 支持导入书签（目前仅测试过导入 Chrome 导出的书签数据）
- 支持禁用登录功能，便于内网部署使用

## 技术栈

- Node.js 26
- [Next.js](https://nextjs.org/) 16（App Router）
- TypeScript
- React 19
- 配置存储：本地磁盘 / WebDAV / Upstash Redis
- Docker

## 安装

```bash
# 初始化数据目录
mkdir /path/to/data
# 容器使用 1001 用户/用户组运行
chown 1001:1001 /path/to/data

docker pull knives/firefly

docker run -p 3000:3000 -v /path/to/data:/app/data -e FIREFLY_DISABLE_LOGIN=true knives/firefly
```

## 环境变量选项

- FIREFLY_TITLE：页面标题，默认为 `Firefly`
- FIREFLY_USERNAME：登录用户名，不启用 `FIREFLY_DISABLE_LOGIN` 选项时必填
- FIREFLY_PASSWORD：登录密码，不启用 `FIREFLY_DISABLE_LOGIN` 选项时必填
- FIREFLY_DISABLE_LOGIN：禁用登录功能，禁用后将关闭登录认证和私密链接功能，一般用于内网部署
- FIREFLY_EXPIRE：登录认证有效期，单位为秒；默认为 10 天
- DISK_PATH：配置存储路径，Docker 镜像默认设置为 `/app/data`
- WEBDAV_HOST：WebDAV 服务器地址。配置该变量后，启用 WebDAV 作为配置存储目标
- WEBDAV_USERNAME：WebDAV 认证用户
- WEBDAV_PASSWORD：WebDAV 认证密码
- WEBDAV_AUTH_TYPE：WebDAV 认证类型，目前支持 `Digest` 和 `Password` 两种，默认为 `Password`
- WEBDAV_DIRECTORY：WebDAV 存储路径，默认为 `/`
- KV_REST_API_URL / KV_REST_API_TOKEN：Vercel 的 Upstash 集成会自动注入，存在时使用 Upstash Redis 存储
- UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN：手动配置 Upstash Redis（非 Vercel 部署）时使用，与上面的 `KV_*` 二选一
- REDIS_KEY_PREFIX：Redis 键前缀，默认为 `firefly:`，多个实例共用同一数据库时用来区分

存储后端的选择顺序为 **Upstash Redis → WebDAV → 本地磁盘**：只要配置了 Redis 就会忽略 `DISK_PATH`。

## 本地开发

```bash
npm install
npm run dev   # 自动生成图标索引后启动，默认 http://localhost:3000
```

本地环境变量放在 `.env.local`，最简配置：

```bash
FIREFLY_DISABLE_LOGIN=false
FIREFLY_USERNAME=admin
FIREFLY_PASSWORD=admin
DISK_PATH=./.data
```

图标选择器的搜索索引 `public/assets/icons.json` 由 `npm run gen-icons` 生成（`dev` / `build` 会自动执行），未生成时选择器为空。

## 参考项目

- [Flame](https://github.com/pawelmalak/flame)
- [Flare](https://github.com/soulteary/flare)
