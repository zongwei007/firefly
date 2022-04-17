async function request<T>(resource: RequestInfo, init?: RequestInit): Promise<T> {
  const resp = await fetch(resource, init);

  if (!resp.ok) {
    throw { ...(await resp.json()), status: resp.status };
  }

  if (resp.status === 204) {
    return undefined as unknown as T;
  }

  return (await resp.json()) as T;
}

export default request;
