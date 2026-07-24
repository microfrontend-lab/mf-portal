import path from 'node:path';
import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';

const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
  entry: './src/index.tsx',
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'cheap-module-source-map' : false,
  output: {
    // See todo-app/rspack.config.ts for why this isn't 'auto': the initial
    // <script> tag in index.html needs a build-time-known prefix so deep
    // links served via the SPA not_found_page fallback (e.g. /apps/chart)
    // resolve correctly.
    publicPath: isDev ? '/' : '/mf-portal/',
    uniqueName: 'mfPortal',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: { syntax: 'typescript', tsx: true },
              transform: { react: { runtime: 'automatic', development: isDev } },
            },
          },
        },
        type: 'javascript/auto',
      },
      {
        test: /\.module\.css$/,
        type: 'css/module',
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        type: 'css',
      },
    ],
    parser: {
      'css/module': { namedExports: false },
    },
    generator: {
      'css/module': { exportsConvention: 'camel-case-only' },
    },
  },
  plugins: [
    new rspack.HtmlRspackPlugin({ template: './public/index.html' }),
    new rspack.DefinePlugin({
      'process.env.REGISTRY_URL': JSON.stringify(process.env.REGISTRY_URL ?? ''),
    }),
    new rspack.CopyRspackPlugin({
      patterns: [{ from: 'resources', to: '.', noErrorOnMissing: true }],
    }),
  ],
  devServer: {
    port: 3000,
    static: [
      { directory: path.resolve(__dirname, 'public') },
      { directory: path.resolve(__dirname, 'resources') },
    ],
    headers: { 'Access-Control-Allow-Origin': '*' },
    historyApiFallback: true,
  },
});
