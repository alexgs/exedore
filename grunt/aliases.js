module.exports = {

    'basic-build': {
        description: 'Just build the library',
        tasks: [ 'babel' ]
    },

    build: {
        description: 'Build the library and then run the tests',
        tasks: [ 'basic-build', 'tests' ]
    },

    default: [ 'basic-build' ],

    dev: {
        description: 'Build, test, and watch for changes',
        tasks: [ 'build', 'watch:tests' ]
    },

    'dev-examples': {
        description: 'Build, run examples, and watch for changes',
        tasks: [ 'examples', 'watch:examples' ]
    },

    examples: {
        description: 'Build the library and run the examples',
        tasks: [ 'basic-build', 'run-examples' ]
    },

    'run-examples': {
        description: 'Just run the examples',
        tasks: [ 'mochaTest:examples' ]
    },

    tests: {
        description: 'Just run the tests',
        tasks: [ 'mochaTest:tests' ]
    }

};
