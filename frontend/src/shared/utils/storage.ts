export type StorageValue<T> = {
  value: T;
  expiresAt?: number;
};

export type SetOptions = {
  ttl?: number;
};
const PREFIX = "user-management-app";

const buildKey = (key: string) => `${PREFIX}:${key}`;

export const storage = {
  set<T>(key: string, value: T, options?: SetOptions) {
    const payload: StorageValue<T> = {
      value,
      expiresAt: options?.ttl ? Date.now() + options.ttl : undefined,
    };

    localStorage.setItem(buildKey(key), JSON.stringify(payload));
  },

  get<T>(key: string): T | null {
    const raw = localStorage.getItem(buildKey(key));
    if (!raw) return null;

    try {
      const parsed: StorageValue<T> = JSON.parse(raw);

      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        localStorage.removeItem(buildKey(key));
        return null;
      }

      return parsed.value;
    } catch {
      localStorage.removeItem(buildKey(key));
      return null;
    }
  },

  remove(key: string) {
    localStorage.removeItem(buildKey(key));
  },

  clear() {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(`${PREFIX}:`))
      .forEach((k) => localStorage.removeItem(k));
  },
};
