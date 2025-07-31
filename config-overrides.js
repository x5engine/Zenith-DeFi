const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add buffer polyfill
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "buffer": require.resolve("buffer/"),
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "util": require.resolve("util/"),
    "process": require.resolve("process/browser"),
  };

  // Add plugins
  config.plugins = [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
    ...config.plugins,
  ];

  return config;
}; 