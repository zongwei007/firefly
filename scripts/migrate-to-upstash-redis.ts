/**
 * 一次性迁移脚本：把 bookmarks.yml / settings.yml 从旧存储迁移到 Upstash Redis。
 *
 * 源存储按环境变量选择：设置了 WEBDAV_HOST 用 WebDAV，否则用 DISK_PATH。
 * 目标存储必须配置 KV_REST_API_URL/TOKEN 或 UPSTASH_REDIS_REST_URL/TOKEN。
 *
 * 运行：
 *   node --env-file=.env.local --experimental-strip-types scripts/migrate-to-upstash-redis.ts
 *
 * 只读旧存储、只写新存储，不会删除任何源数据。
 */
import { DiskStorage } from '../infrastructure/storage/disk.ts';
import { UpstashRedisStorage } from '../infrastructure/storage/upstash-redis.ts';
import { WebdavStorage } from '../infrastructure/storage/webdav.ts';

const FILES = ['bookmarks.yml', 'settings.yml'] as const;

function resolveSource(): SettingStorage {
  if (process.env.WEBDAV_HOST) {
    return new WebdavStorage({
      mode: 'webdav',
      host: process.env.WEBDAV_HOST,
      username: process.env.WEBDAV_USERNAME!,
      password: process.env.WEBDAV_PASSWORD!,
      authType: (process.env.WEBDAV_AUTH_TYPE as 'Digest' | 'Password') ?? 'Password',
      directory: process.env.WEBDAV_DIRECTORY ?? '/',
    });
  }

  if (!process.env.DISK_PATH) {
    throw new Error('缺少迁移源：请设置 WEBDAV_HOST 或 DISK_PATH');
  }

  return new DiskStorage({ mode: 'disk', path: process.env.DISK_PATH });
}

async function main() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error('缺少目标存储：请设置 KV_REST_API_URL/TOKEN 或 UPSTASH_REDIS_REST_URL/TOKEN');
  }

  const source = resolveSource();
  const target = new UpstashRedisStorage({
    mode: 'upstash-redis',
    url,
    token,
    prefix: process.env.REDIS_KEY_PREFIX ?? 'firefly:',
  });

  for (const name of FILES) {
    const data = await source.read(name);

    if (data == null) {
      console.log(`源存储中不存在 ${name}，跳过`);
      continue;
    }

    await target.write(name, data);

    const verify = await target.read(name);

    if (verify == null) {
      throw new Error(`${name} 写入后读回为空，请检查 Redis 连接`);
    }

    console.log(`已迁移 ${name}`);
  }

  console.log('迁移完成，源数据未改动');
}

main().catch(e => {
  console.error('迁移失败', e);
  process.exit(1);
});
