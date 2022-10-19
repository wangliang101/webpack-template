const prodConfig = require('./webpack.base.js');
const { merge } = require('webpack-merge');

// This plugin measures your webpack build speed,
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap(merge(prodConfig, {}));
