module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui"],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/app/home',
        permanent: true,
      },
    ]
  },
  pageExtensions: ["page.tsx", 'page.ts', 'api.ts'],
  experimental: {
    serverComponentsExternalPackages: ['soundcloud.ts'],
  },
};
