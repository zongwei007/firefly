import type { WebDAVClient } from 'webdav';
import YAML from 'yaml';
import { AuthType, createClient } from 'webdav';
import * as environment from 'infrastructure/environment';
import fs from 'fs/promises';

export interface Storage {
  read<T>(name: string): Promise<T | null>;

  write(name: string, value: unknown): Promise<void>;
}

export class DiskStorage implements Storage {
  private readonly directory: string;

  constructor(cfg: DiskStorageConfiguration) {
    this.directory = cfg.path;
  }

  async read<T>(name: string): Promise<T | null> {
    try {
      const yaml = await fs.readFile(`${this.directory}/${name}`, { encoding: 'utf8' });

      return YAML.parse(yaml);
    } catch (e: any) {
      if (e.code === 'ENOENT') {
        return null;
      }

      throw e;
    }
  }

  async write(name: string, value: unknown): Promise<void> {
    const yaml = YAML.stringify(value);

    try {
      await fs.writeFile(`${this.directory}/${name}`, yaml);
    } catch (e) {}
  }
}

export class WebdavStorage implements Storage {
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
      if (e.status === 409 && !(await this.client.exists(this.directory))) {
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

const storage: Storage = (cfg => {
  if ('path' in cfg) {
    return new DiskStorage(cfg);
  }

  return new WebdavStorage(cfg);
})(environment.get().storage);

export default storage;