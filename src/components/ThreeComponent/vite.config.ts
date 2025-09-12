import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import {viteStaticCopy} from 'vite-plugin-static-copy'

const pathResolve = (dir: string) => {
    return resolve(__dirname, '.', dir);
};
const alias: Record<string, string> = {
    '@': pathResolve('./src'),
};

// https://vitejs.dev/config/
export default defineConfig({
    base:'./',
    build:{
        outDir: 'HThree', //输出文件名称
        lib:{
            entry: resolve(__dirname, './index.ts'), //指定组件编译入口文件
            name: 'h-three',
            fileName: 'h-three'
        },//库编译模式配置
        rollupOptions: {
            external: ['vue'],
            output: {
                // format: 'es', // 默认es，可选 'amd' 'cjs' 'es' 'iife' 'umd' 'system'
                exports: 'named',
                globals: {
                    vue:'Vue',
                },
            }
        },
        minify: 'terser', // Vite 2.6.x 以上需要配置 minify: "terser", terserOptions 才能生效
        terserOptions: { // 在打包代码时移除 console、debugger 和 注释
            compress: {
                drop_console: true, // 生产环境时移除console
                drop_debugger: true // 生产环境时移除debugger
            },
            format: {
                comments: false // 删除注释comments
            }
        }
    },
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        viteStaticCopy({
            targets: [
                { src: './README.md', dest: './' },//打包后将README.md文件复制到打包后的目录文件中
            ],
        })
    ],
    resolve: {
        alias,
    },
})


