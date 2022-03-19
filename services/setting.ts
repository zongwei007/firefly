import { read, write } from 'infrastructure/storage';

export async function get(): Promise<ISetting> {
  return (await read<ISetting>('settings.yml')) || { weather: { enable: true, location: '北京 北京市' } };
}

export async function set(data: ISetting): Promise<void> {
  await write('settings.yml', data);
}
