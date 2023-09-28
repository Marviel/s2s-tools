module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui"],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/app/jamns/leaderboard',
        permanent: false,
      },
      {
        source: '/app',
        destination: '/app/jamns/leaderboard',
        permanent: false,
      }
    ]
  },
  pageExtensions: ["page.tsx", 'page.ts', 'api.ts'],
  experimental: {
    serverComponentsExternalPackages: ['soundcloud.ts'],
  },
};
