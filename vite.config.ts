import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv, PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'

function CustomHmr(): PluginOption {
    return {
        name: 'custom-hmr',
        enforce: 'post',
        // HMR
        handleHotUpdate({ file, server }: { file: any; server: any }) {
            if (file.endsWith('.json') || file.endsWith('.env')) {
                console.log('reloading json file...')

                server.ws.send({
                    type: 'full-reload',
                    path: '*',
                })
            }
        },
    }
}
// https://vitejs.dev/config/
export default ({ mode }: { mode: any }) => {
    const env = loadEnv(mode, process.cwd())
    process.env = { ...process.env, ...env }
    return defineConfig({
        plugins: [vue(), CustomHmr()],
        base: './',
        envDir: './',
        envPrefix: ['VITE', 'FIREBASE'],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        server: {
            port: 3000,
            proxy: {
                URL: 'http://localhost:4000',
            },
        },
    })
}
