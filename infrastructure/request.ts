async function request<T>(resource: RequestInfo, init?: RequestInit): Promise<T> {
  const resp = await fetch(resource, init);

  if (!resp.ok) {
    throw { ...(await resp.json()), status: resp.status };
  }

  return (await resp.json()) as T;
}

export default request;
