module.exports = {
    test: {
        options: {
            clearRequireCache: true,
            reporter: 'spec'
        },
        // TODO Update this to run only *.test.js and *examples.js files--and verify correct functioning
        src: [ 'lib/**/*.js' ]
    }
};
