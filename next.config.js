/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // App Routerを使用
  },
  // パスエイリアスの解決を明示的に設定
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, '.'),
    }
    return config
  },
}

module.exports = nextConfig
