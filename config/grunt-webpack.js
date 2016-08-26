'use strict';
let webpackMerge = require( 'webpack-merge' );
let commonConfig = require( './webpack.common.js' );

module.exports = {
    common: commonConfig,
    dev: webpackMerge( commonConfig, require( './webpack.dev.js' ) )
};
