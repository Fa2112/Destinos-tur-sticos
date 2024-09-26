// vite.config.js

import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import path from 'path';

export default defineConfig({
  base: '/destinos-turisticos/',
  publicPath: "/destinos-turisticos/",
  plugins: [glsl({
    include: [
      '**/*.glsl', '**/*.wgsl',
      '**/*.vert', '**/*.frag',
      '**/*.vs', '**/*.fs'
    ],

    exclude: undefined,
    warnDuplicatedImports: true,
    defaultExtension: 'glsl',
    compress: false,
    watch: true,

  })],
  resolve: {
    alias: {
      '@shaders': path.resolve(__dirname, './src/shaders'),
      '@images': path.resolve(__dirname, './src/img'),
      '@cubemaps': path.resolve(__dirname, './src/bg_cubemap_nebula'),
      '@utils': path.resolve(__dirname, './src/utils'),
    }
  }

});