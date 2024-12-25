/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string; // Определяем вашу переменную
  readonly VITE_FACEBOOK_ID: string; // Определяем вашу переменную
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
