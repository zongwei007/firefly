import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Vercel 上禁用 standalone，避免 Next 16.3 的 nft.json 构建回归（issue #96646）
  output: process.env.VERCEL ? undefined : 'standalone',
};

export default nextConfig;
