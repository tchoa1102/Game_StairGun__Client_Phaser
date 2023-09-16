/// <reference types="vite/client" />
declare namespace NodeJS {
    interface ProcessEnv {
        VUE_APP_FBASE_API_KEY: string
        VUE_APP_FBASE_AUTH_DOMAIN: string
        VUE_APP_FBASE_PROJECT_ID: string
        VUE_APP_FBASE_STORAGE_BUCKET: string
        VUE_APP_FBASE_MESSAGIN_SENDER_ID: string
        VUE_APP_FBASE_APP_ID: string
    }
}
