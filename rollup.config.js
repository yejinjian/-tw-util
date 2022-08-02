import path from 'path'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import alias from '@rollup/plugin-alias'
import babel, {getBabelOutputPlugin} from '@rollup/plugin-babel'
import strip from '@rollup/plugin-strip';
import { terser } from "rollup-plugin-terser"
import {peerDependencies} from './package.json';

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

export default  {
  input: {
    index: path.resolve(__dirname, 'src/index.js')
  },
  output: {
    dir: path.resolve(__dirname, 'dist'),
    entryFileNames: `[name].js`,
    chunkFileNames: 'chunks/dep-[hash].js',
    exports: 'named',
    format: 'cjs',
    preserveModules:false,
    externalLiveBindings: false,
    freeze: false,
    sourcemap: false
  },
  onwarn(warning, warn) {
    // node-resolve complains a lot about this but seems to still work?
    if (warning.message.includes('Package subpath')) {
      return
    }
    // we use the eval('require') trick to deal with optional deps
    if (warning.message.includes('Use of eval')) {
      return
    }
    if (warning.message.includes('Circular dependency')) {
      return
    }
    warn(warning)
  },
  external: Object.keys(peerDependencies||{}),
  plugins: [
    alias({
      entries:{
        '@': path.resolve(__dirname,'src')
      }
    }),
    nodeResolve({browser: true, preferBuiltins: true,extensions: ['.js','.vue']}),
    commonjs(),
    getBabelOutputPlugin({
      configFile: path.resolve(__dirname, '.babelrc'),
      allowAllFormats: true
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: '**/node_modules/**',
      skipPreflightCheck: true
    }),
    json(),
    IS_PROD && strip(),
    IS_PROD && terser()
  ].filter(Boolean)
}
