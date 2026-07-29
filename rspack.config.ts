import path from 'node:path';
import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';

const isDev = process.env.NODE_ENV !== 'production';
// Firebase Hosting serves this app from its own domain root in both dev and
// prod (unlike the old GCS-bucket deploy, which nested it under
// /mf-portal/) — so '/' is correct everywhere now, no per-mode branch
// needed.
const publicPath = '/';

export default defineConfig({
  entry: './src/index.tsx',
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'cheap-module-source-map' : false,
  output: {
    publicPath,
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
      'process.env.PUBLIC_PATH': JSON.stringify(publicPath),
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
