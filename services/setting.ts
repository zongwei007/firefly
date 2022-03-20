import { read, write } from 'infrastructure/storage';

const DEFAULTS: ISetting = {
  weather: { enable: true, location: '北京 北京市' },
  search: { enable: true, autoFocus: true },
  ui: {
    clock: { enable: true, welcome: '你好' },
    favorite: { enable: true },
    bookmark: { enable: true },
  },
};

export async function get(): Promise<ISetting> {
  return { ...DEFAULTS, ...(await read<ISetting>('settings.yml')) };
}

export async function set(data: ISetting): Promise<void> {
  await write('settings.yml', data);
}
