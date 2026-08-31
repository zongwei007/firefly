[![](https://github.com/zongwei007/firefly/actions/workflows/build.yml/badge.svg)](https://github.com/zongwei007/firefly/actions/workflows/build.yml)

Firefly is a self-hosted personal homepage designed to collect and manage frequently visited websites as centralized bookmark links, elegantly resolving cross-browser bookmark synchronization issues.

## Features

- Built-in category and bookmark editors
- Supports displaying weather information for configured locations
- Supports pinning bookmarks as favorites
- Supports setting bookmarks as private (visible only after login)
- Supports bookmark search
- Supports importing bookmarks (currently tested only with bookmarks exported from Chrome)
- Supports disabling login functionality for convenient internal network deployment

## Tech Stack

- Node.js
- [Next.js](https://nextjs.org/)
- TypeScript
- React
- Docker

## Installation

```bash
# Initialize data directory
mkdir /path/to/data
# Run the container with user/group 1001
chown 1001:1001 /path/to/data

docker pull knives/firefly

docker run -p 3000:3000 -v /path/to/data:/app/data -e FIREFLY_DISABLE_LOGIN=true knives/firefly
```

## Environment Variables

- **FIREFLY_TITLE**: Page title, defaults to `Firefly`
- **FIREFLY_USERNAME**: Login username, required if `FIREFLY_DISABLE_LOGIN` is not enabled
- **FIREFLY_PASSWORD**: Login password, required if `FIREFLY_DISABLE_LOGIN` is not enabled
- **FIREFLY_DISABLE_LOGIN**: Disables login functionality. When disabled, login authentication and private link features are turned off, typically used for internal network deployments
- **FIREFLY_EXPIRE**: Login session validity period in seconds; defaults to 10 days
- **DISK_PATH**: Configuration storage path, defaults to `/app/data` in Docker image
- **WEBDAV_HOST**: WebDAV server address. Set this variable to enable WebDAV as the configuration storage target
- **WEBDAV_USERNAME**: WebDAV authentication username
- **WEBDAV_PASSWORD**: WebDAV authentication password
- **WEBDAV_AUTH_TYPE**: WebDAV authentication type, supports `Digest` and `Password`; defaults to `Password`
- **WEBDAV_DIRECTORY**: WebDAV storage path, defaults to `/`

## Reference Projects

- [Flame](https://github.com/pawelmalak/flame)
- [Flare](https://github.com/soulteary/flare)
