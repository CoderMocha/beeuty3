import { defineConfig } from "vite";
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    target: 'modules',
    // 打包文件目录
    outDir: 'es',
    // 压缩
    minify: true,
    // css分离
    cssCodeSplit: true,
    rollupOptions: {
      // 忽略打包vue文件
      external: ['vue'],
      input: ['src/index.ts'],
      output: [
        {
          format: 'es',
          // 不用打包为*.es.js，直接打包为*.js
          entryFileNames: '[name].js',
          // 打包目录与开发目录对应
          preserveModules: true,
          // 配置打包目录
          dir: 'es',
          preserveModulesRoot: 'src',
        },
        {
          format: 'cjs',
          entryFileNames: '[name].js',
          preserveModules: true,
          dir: 'lib',
          preserveModulesRoot: 'src',
        }
      ],
    },
    lib: {
      entry: './index.ts',
      formats: ['es', 'cjs'],
    }
  },
  plugins: [
    vue(),
    dts({
      tsConfigFilePath: '../tsconfig.json'
    }),
    dts({
      outputDir: 'lib',
      tsConfigFilePath: '../tsconfig.json'
    })
  ]
})
