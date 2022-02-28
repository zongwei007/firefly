Firefly 是一个自托管的个人首页工具，用于集中管理个人用户的常用网站和 Web 应用地址。

Firefly 用 [Next.js](https://nextjs.org/) 框架编写，可以直接部署到大多数的 serverless 平台上。
同时，也支持通过 docker 等方式手动安装运行。

为支持在 serverless 平台上运行，Firefly 选择了无数据库设计。数据直接以 yml 格式，通过 WEBDAV 接口保存到指定的服务器目录。
后期可能会扩展其他的持久化方案。 

Firefly 参考了以下项目：
* [Flame](https://github.com/pawelmalak/flame)
* [Flare](https://github.com/soulteary/flare)