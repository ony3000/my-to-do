module.exports = {
  swcMinify: true,
  eslint: {
    dirs: [
      // default directories
      'pages',
      'components',
      'lib',
      'src',

      // custom directories
      'hooks',
      'layouts',
      'plugins',
      'store',
      'types',
    ],
  },
};
