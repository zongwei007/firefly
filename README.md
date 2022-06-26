[![Build](https://github.com/zongwei007/firefly/actions/workflows/build.yml/badge.svg)](https://github.com/zongwei007/firefly/actions/workflows/build.yml)

Firefly 是一个自托管的个人首页，用于将常用网站收录为书签链接集中管理和显示，曲线解决跨浏览器的书签同步问题

## 功能

- 内置分类编辑器和书签编辑器
- 支持显示配置地点的天气信息
- 支持将书签置顶为常用书签
- 支持将书签设置为私密书签，仅登录后显示
- 支持书签搜索
- 支持导入书签（目前仅测试过导入 Chrome 导出的书签数据）
- 支持禁用登录功能，便于内网部署使用

## 技术栈

- Nodejs
- [Next.js](https://nextjs.org/)
- Typescript
- React
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

## 参考项目

- [Flame](https://github.com/pawelmalak/flame)
- [Flare](https://github.com/soulteary/flare)
