import { fromSetting } from '@/actions/weather';
import { get as getSettings } from '@/actions/setting';

export async function GET() {
  try {
    const settings = await getSettings();
    const resp = await fromSetting(settings.weather);

    return Response.json(resp);
  } catch (e) {
    return Response.json({ message: (e as { message: string }).message }, { status: 500 });
  }
}
