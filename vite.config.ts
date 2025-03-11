import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'
import { loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())
  
  // 根据环境变量决定是否启用 mock
  const isMockEnabled = env.VITE_APP_MOCK === 'true'
  
  return {
    plugins: [
      vue(),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia',
          '@vueuse/core',
        ],
        dts: 'src/auto-imports.d.ts',
      }),
      Components({
        resolvers: [NaiveUiResolver()],
        dts: 'src/components.d.ts',
      }),
      viteMockServe({
        mockPath: 'mock',
        enable: isMockEnabled,
        logger: true,
        watchFiles: true,
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    }
  }
})
