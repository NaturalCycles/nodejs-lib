module.exports = {
  title: 'nodejs-lib',
  base: '/nodejs-lib/',

  themeConfig: {
    // search: false,
    repo: 'NaturalCycles/nodejs-lib',
    docsDir: 'docs',
    smoothScroll: true,
    nav: [],
    sidebar: {
      '/': [
        {
          // title: 'Menu',
          collapsable: false,
          children: [
            '',
            'validation',
            // 'http',
            'fs',
            'stream',
            'colors',
            'exec',
            'secrets',
            'security',
            'script',
            'slack',
            'other',
          ],
        },
      ],
    },
  },

  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    [
      'vuepress-plugin-typescript',
      {
        tsLoaderOptions: {
          transpileOnly: true,
        },
      },
    ],
  ],
  evergreen: true,
}
