// vite.config.js

import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({

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
  root: '/',
  base: 'https://fa2112.github.io/destinos-turisticos/'

})]
});