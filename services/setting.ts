import { read, write } from 'infrastructure/storage';

export async function get(): Promise<ISetting> {
  return (
    (await read<ISetting>('settings.yml')) || {
      weather: { enable: true, location: '北京 北京市' },
      search: { enable: true, autoFocus: true },
    }
  );
}

export async function set(data: ISetting): Promise<void> {
  await write('settings.yml', data);
}
