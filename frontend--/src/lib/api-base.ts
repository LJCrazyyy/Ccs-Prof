const LOCAL_API_BASE = 'http://localhost:8080';
const PRODUCTION_API_BASE = 'https://itew6-project-1lhh.onrender.com';

const isLocalhostUrl = (value: string) =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(value);

export const getApiBase = () => {
  const configuredBase = import.meta.env.VITE_API_BASE_URL?.trim();

  if (configuredBase) {
    if (!import.meta.env.DEV && isLocalhostUrl(configuredBase)) {
      return PRODUCTION_API_BASE;
    }

    return configuredBase;
  }

  return import.meta.env.DEV ? LOCAL_API_BASE : PRODUCTION_API_BASE;
};