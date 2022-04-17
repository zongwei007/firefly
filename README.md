[![Build](https://github.com/zongwei007/firefly/actions/workflows/build.yml/badge.svg)](https://github.com/zongwei007/firefly/actions/workflows/build.yml)

Firefly 是一个自托管的个人首页工具，用于集中管理个人用户的常用网站和 Web 应用地址。

Firefly 使用 [Next.js](https://nextjs.org/) 编写，可以直接部署到大多数的 serverless 平台上；
同时，也支持通过 docker 等方式手动安装运行。

Firefly 的数据直接以 yml 格式保存，目前支持本地磁盘存储和 WebDAV 两种持久化方式。

Firefly 参考了以下项目：
* [Flame](https://github.com/pawelmalak/flame)
* [Flare](https://github.com/soulteary/flare)