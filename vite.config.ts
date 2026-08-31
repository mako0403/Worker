import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { VantResolver } from 'unplugin-vue-components/resolvers'




// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [
            vue(),
            vueDevTools(),
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver(), VantResolver()],
            })
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
            // 编译输出配置
            rollupOptions: {
                output: {
                    // 配置 chunk 的输出路径
                    chunkFileNames: 'assets/js/[name]-[hash].js',
                    // 配置 entry point 的输出路径
                    entryFileNames: 'assets/js/[name]-[hash].js',
                    // 配置 asset 的输出路径
                    assetFileNames: (assetInfo) => {
                        const extType = assetInfo.name.split('.').at(-1);
                        if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(extType)) {
                            return `assets/images/[name]-[hash][extname]`;
                        }
                        if (/woff2?|eot|ttf|otf/i.test(extType)) {
                            return `assets/fonts/[name]-[hash][extname]`;
                        }
                        if (/css/i.test(extType)) {
                            return `assets/css/[name]-[hash][extname]`;
                        }
                        // 默认的 assets 输出路径
                        return `assets/[name]-[hash][extname]`;
                    },
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
