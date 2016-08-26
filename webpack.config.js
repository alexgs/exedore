'use strict';
let webpackMerge = require( 'webpack-merge' );

let commonConfig = require( './config/webpack.common.js' );
let devConfig = require( './config/webpack.dev.js' );

module.exports = webpackMerge(
    commonConfig,
    devConfig
);
