const webpack = require('webpack');
const path = require('path');

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "assert": require.resolve("assert"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "url": require.resolve("url"),
    "zlib": require.resolve("browserify-zlib"),
    "buffer": require.resolve("buffer"),
    "process": require.resolve("process/browser.js"),
  });
  config.resolve.fallback = fallback;
  
  // Get the exact path to process/browser.js
  const processBrowserPath = require.resolve('process/browser.js');
  
  // Add alias for process/browser (with and without extension)
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    'process/browser': processBrowserPath,
    'process/browser.js': processBrowserPath,
  };
  
  // Disable fullySpecified for all modules
  config.resolve.fullySpecified = false;
  
  // Add extensionAlias to help webpack resolve process/browser
  config.resolve.extensionAlias = {
    '.js': ['.js', '.ts', '.tsx'],
    '.mjs': ['.mjs', '.js'],
  };
  
  // Add module rules to handle ESM modules
  if (!config.module) {
    config.module = {};
  }
  if (!config.module.rules) {
    config.module.rules = [];
  }
  
  // Find the oneOf rule and add our rule
  const oneOfRule = config.module.rules.find((rule) => rule.oneOf);
  if (oneOfRule && oneOfRule.oneOf) {
    // Insert at the beginning
    oneOfRule.oneOf.unshift({
      test: /\.m?js$/,
      include: /node_modules/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });
  }
  
  // Create NormalModuleReplacementPlugin for process/browser
  const processBrowserPlugin = new webpack.NormalModuleReplacementPlugin(
    /^process\/browser$/,
    processBrowserPath
  );
  
  // Also handle process/browser.js
  const processBrowserJsPlugin = new webpack.NormalModuleReplacementPlugin(
    /^process\/browser\.js$/,
    processBrowserPath
  );
  
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer']
    }),
    new webpack.DefinePlugin({
      'global': 'globalThis',
    }),
    processBrowserPlugin,
    processBrowserJsPlugin,
  ]);
  
  // Ignore warnings about process/browser
  config.ignoreWarnings = [
    /Failed to parse source map/,
    /process\/browser/,
    /Can't resolve 'process\/browser'/,
  ];
  
  return config;
};

