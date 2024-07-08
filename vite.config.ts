import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// import path from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  build:{
    minify: 'terser',
    terserOptions: {
      compress: {
        //打包去除打印
        drop_console: true,
        drop_debugger: true,
      }
    },
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      imports:['vue','vue-router'],
      dts:'src/auto-imports.d.ts'
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  server: {
    https: false,
    host: '0.0.0.0',
    port:5174,
    open: true
  },
})
