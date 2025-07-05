import * as settingService from '@/actions/setting';
import Search from './Search';

export default async function WeatherPage() {
  const settings = await settingService.get();
  async function handleChange(formData: FormData) {
    'use server';

    await settingService.set({
      ...settings,
      search: {
        enable: 'true' === formData.get('enable'),
        autoFocus: 'true' === formData.get('auto-focus'),
      },
    });
  }

  return <Search defaultValue={settings.search} onChange={handleChange} version={settings.lastModifiedAt} />;
}
