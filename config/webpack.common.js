var path = require( 'path' );
var webpack = require( 'webpack' );

module.exports = {
    entry: {
        'index': './src/index.js',
        'index.test': './src/index.test.js'
    },

    resolve: {
        extensions: [ '', '.js' ]
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    // These are the plugins that comprise the 'es2015' preset.
                    // Plugins may be disabled when there is good support for a
                    // feature in the "evergreen" browsers/engines.
                    plugins: [
                        'check-es2015-constants',
                        'transform-es2015-arrow-functions',
                        'transform-es2015-block-scoped-functions',
                        'transform-es2015-block-scoping',
                        // 'transform-es2015-classes',
                        'transform-es2015-computed-properties',
                        'transform-es2015-destructuring',
                        'transform-es2015-duplicate-keys',
                        'transform-es2015-for-of',
                        'transform-es2015-function-name',
                        'transform-es2015-literals',
                        'transform-es2015-modules-commonjs',
                        // 'transform-es2015-object-super',
                        'transform-es2015-parameters',
                        'transform-es2015-shorthand-properties',
                        'transform-es2015-spread',
                        'transform-es2015-sticky-regex',
                        'transform-es2015-template-literals',
                        'transform-es2015-typeof-symbol',
                        'transform-es2015-unicode-regex',
                        'transform-regenerator'
                    // ].map( plugin => path.resolve( './node_modules', 'babel-preset-es2015', 'node_modules', plugin ) )
                    // ].map( plugin => './node_modules/babel-preset-es2015/node_modules/' + plugin )
                    ]
                }
            }
        ]
    }

};
