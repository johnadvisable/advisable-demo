// @ts-nocheck
/// <reference types="vite/client" />

// Global bypass for Vite environment
interface ImportMetaEnv {
  [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Complete module override for Vite context
declare module "*" {
  const content: any;
  export = content;
  export default content;
}

// Export to make this a module
export {};