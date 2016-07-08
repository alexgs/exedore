module.exports = {

    tests: {
        options: {
            clearRequireCache: true,
            reporter: 'spec'
        },
        src: [ 'lib/**/*.test.js' ]
    },

    examples: {
        options: {
            clearRequireCache: true,
            reporter: 'spec'
        },
        src: [ 'lib/**/*examples.js' ]
    }

};
