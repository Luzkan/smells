import { vi } from 'vitest';

type GlobalOverrides = {
  window?: unknown;
  document?: unknown;
  localStorage?: unknown;
  location?: unknown;
};

export function installGlobals(props: GlobalOverrides): () => void {
  const keys = Object.keys(props) as (keyof GlobalOverrides)[];
  for (const key of keys) {
    Object.defineProperty(globalThis, key, { value: props[key], configurable: true });
  }
  return () => {
    for (const key of keys) {
      delete (globalThis as Record<string, unknown>)[key];
    }
  };
}

export function createLocalStorageMock(initial: Record<string, string> = {}) {
  const store = new Map<string, string>(Object.entries(initial));
  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
  };
}
