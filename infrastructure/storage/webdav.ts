import { AuthType, createClient, WebDAVClient } from 'webdav';
import YAML from 'yaml';

export class WebdavStorage implements SettingStorage {
  private readonly directory: string;
  private readonly client: WebDAVClient;

  constructor(cfg: WebdavStorageConfiguration) {
    const authType = cfg.authType === 'Digest' ? AuthType.Digest : AuthType.Password;

    this.directory = cfg.directory;
    this.client = createClient(cfg.host, {
      authType,
      username: cfg.username,
      password: cfg.password,
      withCredentials: true,
    });

    console.log(`使用 WebDAV 存储，路径 ${this.directory}`);
  }

  private async checkDirectoryExisted(): Promise<boolean> {
    try {
      return await this.client.exists(this.directory);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e.status === 409) {
        return false;
      }

      throw e;
    }
  }

  async read<T>(name: string): Promise<T | null> {
    try {
      const yaml = (await this.client.getFileContents(`${this.directory}/${name}`, { format: 'text' })) as string;

      if (!yaml.includes(':')) {
        return null;
      }

      return YAML.parse(yaml);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e.status === 404) {
        return null;
      }

      if (e.status === 409 && !(await this.checkDirectoryExisted())) {
        return null;
      }

      throw e;
    }
  }

  async write(name: string, value: unknown): Promise<void> {
    const yaml = YAML.stringify(value);
    const buffer = Buffer.from(yaml, 'utf-8');

    try {
      await this.client.putFileContents(`${this.directory}/${name}`, buffer, {
        overwrite: true,
        contentLength: buffer.length,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e.status === 409 && !(await this.checkDirectoryExisted())) {
        try {
          await this.client.createDirectory(this.directory, { recursive: true });
        } catch (ex) {
          console.log(`创建 WebDAV 目录 ${this.directory} 失败`, ex);

          throw ex;
        }

        await this.write(name, value);
        return;
      }

      console.log(`保存文件 ${this.directory}/${name} 失败`, e);

      throw e;
    }

    console.log(`保存文件 ${this.directory}/${name} 成功`);
  }
}
