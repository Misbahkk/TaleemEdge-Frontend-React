/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL_LOCAL: string
  readonly VITE_API_BASE_URL_DEPLOY: string
  // aur jo bhi env vars chahiye
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
