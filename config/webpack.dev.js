
module.exports = {

    devtool: 'source-map',

    output: {
        path: './lib',
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    }

};
