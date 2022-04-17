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
  }

  private async checkDirectoryExisted(): Promise<boolean> {
    try {
      return await this.client.exists(this.directory);
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
    } catch (e: any) {
      if (e.status === 409 && !(await this.checkDirectoryExisted())) {
        try {
          await this.client.createDirectory(this.directory, { recursive: true });
        } catch (ex) {
          throw ex;
        }

        await this.write(name, value);
      }

      throw e;
    }
  }
}
