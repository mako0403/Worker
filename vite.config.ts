import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'




// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [
            vue()
        ],
        base: env.VITE_RUN_PATH,
        build: { 
            //minify: true,
            chunkSizeWarningLimit: 1500,
            // 设置为 false 以禁用 Terser 的默认行为，然后自定义
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true, // 生产环境去除 console
                    drop_debugger: true, // 生产环境去除 debugger
                },
            },
        },
        resolve: {
            // 配置快捷目录
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
                '@@': fileURLToPath(new URL('./public', import.meta.url))
            }
        },
        server: {
            proxy: {
                '/api': {
                    target: env.VITE_BASE_API_RUL, //'http://localhost', // 目标服务器地址
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/api/, '')
                }
            }
        }
    }
})
