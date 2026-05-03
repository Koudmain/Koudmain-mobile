type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  token?: string | null;
  body?: unknown;
};

const RAW_API_HOST = process.env.EXPO_PUBLIC_REACT_NATIVE_PACKAGER_HOSTNAME;

function transformIpBackendUrl(hostOrUrl?: string): string {
  if (!hostOrUrl) return 'http://localhost:3000';

  const trimmed = hostOrUrl.trim().replace(/\/$/, '');
  if (!trimmed) return 'http://localhost:3000';

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  if (/:[0-9]+$/.test(trimmed)) {
    return `http://${trimmed}`;
  }

  return `http://${trimmed}:3000`;
}

const API_URL = transformIpBackendUrl(RAW_API_HOST);

function buildApiUrl(endpoint: string): string {
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  const base = API_URL.replace(/\/$/, '');
  const path = endpoint.replace(/^\//, '');
  return `${base}/${path}`;
}

export async function apiFetch<T>(
  endpoint: string,
  { token, headers, body, ...rest }: ApiFetchOptions = {},
): Promise<T> {
  const requestHeaders = new Headers(headers);
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  if (token) requestHeaders.set('Authorization', `Bearer ${token}`);
  if (!isFormData && body != null && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  const response = await fetch(buildApiUrl(endpoint), {
    ...rest,
    headers: requestHeaders,
    body:
      body == null || isFormData || typeof body === 'string'
        ? (body as BodyInit | null | undefined)
        : JSON.stringify(body),
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data === 'object' && data && 'message' in data
        ? String((data as { message: unknown }).message)
        : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data as T;
}
