/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 应用环境 */
  readonly VITE_APP_ENV: 'development' | 'production'
  /** 应用标题 */
  readonly VITE_APP_TITLE: string
  /** API 基础地址 */
  readonly VITE_API_BASE_URL: string
  /** 是否使用 Mock 数据 */
  readonly VITE_USE_MOCK: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export {}

// 扩展 vue-router 的 RouteMeta 类型
declare module 'vue-router' {
  interface RouteMeta {
    hideInNav?: boolean
    hideLayout?: boolean
  }
}
