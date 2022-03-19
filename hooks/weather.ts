import useSWR from 'swr';
import { useSettings } from 'hooks';

export function useWeather() {
  const { data: setting } = useSettings();

  const { data, error } = useSWR<IWeather>(setting?.weather.enable ? setting.weather.location : null, queryWeather, {
    refreshInterval: 60 * 60 * 1000,
  });

  return { data, error, isLoading: !error && !data };
}

export function queryWeather(location: string): Promise<IWeather> {
  return fetch(`/api/weather?${new URLSearchParams([['location', location]])}`).then(resp => resp.json());
}
