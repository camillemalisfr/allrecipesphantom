const path = require('path');

module.exports = {
  entry: './dist/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  externals: {
    phantombuster: 'commonjs2 phantombuster',
    puppeteer: 'commonjs2 puppeteer'
  },
  optimization: {
    minimize: false
  },
  mode: 'production',
  watch: true
};
