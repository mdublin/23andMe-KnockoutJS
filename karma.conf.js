module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        // For specrunner.karma to work, any dependant libraries must be registered
        // here, so that the karma runner will serve them. If not they will 404.
        files: [
            'src/app/require.config.js',
            'test/require.config.js',
            'node_modules/requirejs/require.js',
            'node_modules/karma-requirejs/lib/adapter.js',
            {
                pattern: 'node_modules/knockout/build/output/knockout-latest.js',
                included: false
            },
            {
                pattern: 'node_modules/requirejs-text/text.js',
                included: false
            },
            'test/SpecRunner.karma.js',
            {
                pattern: 'src/**/*.js',
                included: false
            },
            {
                pattern: 'src/**/*.html',
                included: false
            },
            {
                pattern: 'test/**/*.js',
                included: false
            }
    ],


        // list of files to exclude
        exclude: [

    ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        // For integration with brackets.io editor: https://github.com/artoale/karma-brackets
        reporters: ['progress', 'brackets'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    });
};