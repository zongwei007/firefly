/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputStandalone: true,
  },
  i18n: {
    locales: ['zh-Hans'],
    defaultLocale: 'zh-Hans',
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
