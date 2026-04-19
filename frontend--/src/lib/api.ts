export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8080';

export const apiUrl = (path: string) => {
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
};
