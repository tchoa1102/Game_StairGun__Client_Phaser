/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_API: string

    readonly FIREBASE_API_KEY: string
    readonly FIREBASE_AUTH_DOMAIN: string
    readonly FIREBASE_PROJECT_ID: string
    readonly FIREBASE_STORAGE_BUCKET: string
    readonly FIREBASE_MESSAGIN_SENDER_ID: string
    readonly FIREBASE_APP_ID: string

    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
