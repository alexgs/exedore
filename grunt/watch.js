var path = require( 'path' );
var sourceDir = path.resolve( __dirname, '..', 'src' );

module.exports = {

    examples: {
        files: [ sourceDir + '**/*examples.js' ],
        options: {
            spawn: false
        },
        tasks: [ 'dev-examples' ]
    },

    tests: {
        files: [ sourceDir + '**/*.test.js' ],
        options: {
            spawn: false
        },
        tasks: [ 'dev' ]
    }

};
