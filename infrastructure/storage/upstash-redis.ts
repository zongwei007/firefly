import { Redis } from '@upstash/redis';
import YAML from 'yaml';

export class UpstashRedisStorage implements SettingStorage {
  private readonly client: Redis;
  private readonly prefix: string;

  constructor(cfg: UpstashRedisStorageConfiguration) {
    // 关闭自动反序列化，YAML 内容按原始字符串读写
    this.client = new Redis({
      url: cfg.url,
      token: cfg.token,
      automaticDeserialization: false,
    });
    this.prefix = cfg.prefix;

    console.log(`使用 Upstash Redis 存储，前缀：${this.prefix}`);
  }

  async read<T>(name: string): Promise<T | null> {
    const yaml = await this.client.get<string>(`${this.prefix}${name}`);

    if (!yaml) {
      return null;
    }

    return YAML.parse(yaml);
  }

  async write(name: string, value: unknown): Promise<void> {
    const key = `${this.prefix}${name}`;

    try {
      await this.client.set(key, YAML.stringify(value));
    } catch (e) {
      console.error(`保存 Redis 键 ${key} 失败`, e);

      throw e;
    }

    console.log(`保存 Redis 键 ${key} 成功`);
  }
}
