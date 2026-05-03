import { getApiBase } from './api-base';

export const API_BASE = getApiBase();

export const apiUrl = (path: string) => {
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
};

const routeNotFound = async (response: Response) => {
  if (response.status !== 404) return false;

  try {
    const payload = await response.clone().json();
    return String(payload?.message ?? '').toLowerCase().includes('route not found');
  } catch {
    const text = await response.clone().text();
    return String(text).toLowerCase().includes('route not found');
  }
};

const toFallbackPaths = (path: string) => {
  const normalized = path.startsWith('/') ? path : `/${path}`;

  if (normalized.startsWith('/api/')) {
    return [normalized, normalized.replace(/^\/api/, '')];
  }

  return [normalized, `/api${normalized}`];
};

export const fetchApiWithFallback = async (path: string, init?: RequestInit) => {
  const candidates = toFallbackPaths(path);
  let lastResponse: Response | null = null;

  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    const response = await fetch(apiUrl(candidate), init);

    if (response.ok) {
      return response;
    }

    lastResponse = response;
    const shouldRetry = index < candidates.length - 1 && (await routeNotFound(response));
    if (!shouldRetry) {
      return response;
    }
  }

  return lastResponse as Response;
};
