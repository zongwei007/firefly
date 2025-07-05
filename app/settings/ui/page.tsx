import * as settingService from '@/actions/setting';
import UserInterface from './UserInterface';
import { revalidatePath } from 'next/cache';

export default async function WeatherPage() {
  const settings = await settingService.get();

  async function handleChange(data: FormData) {
    'use server';

    await settingService.set({
      ...settings,
      ui: {
        footer: data.get('footer')?.toString(),
        clock: {
          enable: 'true' === data.get('clock-enable'),
          welcome: data.get('clock-welcome')?.toString() ?? '早上好;中午好;下午好;晚上好',
        },
        favorite: {
          enable: 'true' === data.get('favorite-enable'),
          target: data.get('favorite-target')?.toString(),
        },
        bookmark: {
          enable: 'true' === data.get('bookmark-enable'),
          target: data.get('bookmark-target')?.toString(),
        },
      },
    });

    revalidatePath('/settings/ui');
  }

  return <UserInterface defaultValue={settings.ui} onChange={handleChange} version={settings.lastModifiedAt} />;
}
