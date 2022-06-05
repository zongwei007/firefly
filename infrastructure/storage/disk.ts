import fs from 'fs/promises';
import YAML from 'yaml';

export class DiskStorage implements SettingStorage {
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
    } catch (e) {
      //ignore
    }
  }
}
