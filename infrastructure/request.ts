export default async function request<T>(resource: RequestInfo, init?: RequestInit): Promise<T> {
  const resp = await fetch(resource, init);

  if (!resp.ok) {
    throw { ...(await resp.json()), status: resp.status };
  }

  if (resp.status === 204) {
    return undefined as unknown as T;
  }

  return (await resp.json()) as T;
}

export function localCacheProvider() {
  if (typeof window !== 'undefined') {
    const map = new Map(JSON.parse(localStorage.getItem('swr-cache') || '[]'));

    window.addEventListener('beforeunload', () => {
      localStorage.setItem('swr-cache', JSON.stringify(Array.from(map.entries())));
    });

    return map;
  }

  return new Map();
}
