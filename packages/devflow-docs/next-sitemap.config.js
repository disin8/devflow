/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://dev-flow.xyz',
  generateIndexSitemap: false,
  generateRobotsTxt: true,
  exclude: ['/api/*', '/_not-found', '/llms.txt', '/llms-full.ts'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    transformRobotsTxt: async (_config, robotsTxt) =>
      robotsTxt.replace(/\n# Host\nHost: .*\n/, '\n'),
  },
  transform: async (_config, path) => {
    const isDocsPath = path === '/docs' || path.startsWith('/docs/');

    return {
      loc: path,
      changefreq: path === '/builder' ? 'monthly' : 'weekly',
      priority: path === '/' ? 1 : path === '/docs' ? 0.9 : path === '/builder' ? 0.7 : isDocsPath ? 0.8 : 0.6
    };
  },
};