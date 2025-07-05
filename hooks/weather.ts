'use client';

import useSWR from 'swr';
import request from '@/infrastructure/request';

export function useWeather() {
  const { data, error } = useSWR<IWeather>('/api/weather', request, {
    refreshInterval: 60 * 60 * 1000,
  });

  return { data, error, isLoading: !error && !data };
}
