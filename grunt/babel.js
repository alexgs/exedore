module.exports = {
    options: {
        sourceMap: true,
        // These plugins comprise the "es2015" present and can be selectively
        // disabled for evergreen browsers and environments
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
        ]
    },
    build: {
        files: [
            {
                expand: true,       // Enable dynamic expansion.
                cwd: 'src/',        // Src matches are relative to this path.
                src: [ '**/*.js' ], // Actual pattern(s) to match.
                dest: 'lib/'
            }
        ]
    }
};
