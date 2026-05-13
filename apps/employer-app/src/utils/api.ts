type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  token?: string | null;
  body?: unknown;
  skipAuthRefresh?: boolean;
};

type RefreshHandlers = {
  getRefreshToken: () => Promise<string | null>;
  onAuthRefreshed: (tokens: { accessToken: string; refreshToken: string }) => Promise<void> | void;
  onAuthExpired?: () => Promise<void> | void;
};

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const RAW_API_HOST = process.env.EXPO_PUBLIC_REACT_NATIVE_PACKAGER_HOSTNAME;

export function transformIpBackendUrl(hostOrUrl?: string, port: number = 3000): string {
  if (!hostOrUrl) return `http://localhost:${port}`;

  const trimmed = hostOrUrl.trim().replace(/\/$/, '');
  if (!trimmed) return `http://localhost:${port}`;

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  if (/:[0-9]+$/.test(trimmed)) {
    return `http://${trimmed}`;
  }

  return `http://${trimmed}:${port}`;
}

const API_URL = transformIpBackendUrl(RAW_API_HOST, 3000);

let refreshHandlers: RefreshHandlers | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function configureAuthRefresh(handlers: RefreshHandlers | null): void {
  refreshHandlers = handlers;
}

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
  { token, headers, body, skipAuthRefresh = false, ...rest }: ApiFetchOptions = {},
): Promise<T> {
  async function executeRequest(authToken: string | null | undefined): Promise<T> {
    const requestHeaders = new Headers(headers);
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

    if (authToken) requestHeaders.set('Authorization', `Bearer ${authToken}`);
    if (!isFormData && body != null && !requestHeaders.has('Content-Type')) {
      requestHeaders.set('Content-Type', 'application/json');
    }

    const url = buildApiUrl(endpoint);
    let response: Response;
    try {
      response = await fetch(url, {
        ...rest,
        headers: requestHeaders,
        body:
          body == null || isFormData || typeof body === 'string'
            ? (body as BodyInit | null | undefined)
            : JSON.stringify(body),
      });
    } catch (e) {
      throw new Error(`Network request failed for ${url}: ${String(e)}`);
    }

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson
      ? await response.json().catch(() => null)
      : await response.text().catch(() => null);

    if (!response.ok) {
      let errorMessage = `Request failed (${response.status})`;
      if (data && typeof data === 'object' && 'message' in data) {
        errorMessage = String(data.message);
      }

      throw new ApiError(errorMessage, response.status, data);
    }

    return data as T;
  }

  const canRefresh =
    !skipAuthRefresh &&
    !!token &&
    !endpoint.includes('/auth/login') &&
    !endpoint.includes('/auth/refresh') &&
    !endpoint.includes('/auth/logout');

  try {
    return await executeRequest(token);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401 || !canRefresh) {
      throw error;
    }

    const refreshedAccessToken = await refreshAccessToken();
    if (!refreshedAccessToken) {
      throw error;
    }

    return executeRequest(refreshedAccessToken);
  }
}

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshHandlers) {
    return null;
  }

  if (!refreshPromise) {
    const handlers = refreshHandlers;

    refreshPromise = (async () => {
      const refreshToken = await handlers.getRefreshToken();
      if (!refreshToken) {
        await handlers.onAuthExpired?.();
        return null;
      }

      const response = await fetch(buildApiUrl('/auth/refresh'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const rawData = await response.json().catch(() => null);
      const data = rawData as { access_token?: string; refresh_token?: string } | null;

      if (!response.ok || !data?.access_token || !data?.refresh_token) {
        await handlers.onAuthExpired?.();
        return null;
      }

      const accessToken = data.access_token;
      const newRefreshToken = data.refresh_token;
      await handlers.onAuthRefreshed({
        accessToken,
        refreshToken: newRefreshToken,
      });

      return accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}
