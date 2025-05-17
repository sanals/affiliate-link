/// <reference types="vite-plugin-pwa/client" />

interface RegisterSWOptions {
  immediate?: boolean;
  onNeedRefresh?: () => void;
  onOfflineReady?: () => void;
  onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
  onRegisteredSW?: (swUrl: string, registration: ServiceWorkerRegistration | undefined) => void;
  onRegisterError?: (error: any) => void;
}

declare module 'virtual:pwa-register' {
  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>;
} 