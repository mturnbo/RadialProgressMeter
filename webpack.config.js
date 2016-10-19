var path = require('path');
var webpack = require('webpack');

webpackConfig = {
  entry: './index.js',
  output: {
    path: './dist',
    filename: 'RadialProgressMeter.js'
  }
};

module.exports = webpackConfig;
