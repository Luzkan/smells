declare module 'preact/src/jsx' {
  namespace JSX {
    interface CSSProperties {
      [key: `--${string}`]: string | number | undefined;
    }
  }
}

interface Window {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
}

interface ImportMetaEnv {
  readonly PUBLIC_GA_TRACKING_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
