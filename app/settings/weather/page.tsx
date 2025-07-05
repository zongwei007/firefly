import * as settingService from '@/actions/setting';
import Weather from './Weather';

export default async function WeatherPage() {
  const settings = await settingService.get();

  async function handleChange(formData: FormData) {
    'use server';

    await settingService.set({
      ...settings,
      weather: {
        enable: Boolean(formData.get('enable')),
        location: formData.get('location')!.toString(),
      },
    });
  }

  return <Weather defaultValue={settings.weather} onChange={handleChange} version={settings.lastModifiedAt} />;
}
