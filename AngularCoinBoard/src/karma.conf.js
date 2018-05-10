/** Karma configuration file, see [link](https://karma-runner.github.io/1.0/config/configuration-file.html)
 * for more information
 */

module.exports = function (config) {
    config.set({
        basePath: '../',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        preprocessors: {
            'src/app/**/*.js': ['coverage']
        },
        plugins: [
            require('karma-jasmine'),
            require('karma-coverage'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage-istanbul-reporter'),
            require('@angular-devkit/build-angular/plugins/karma')
        ],
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        coverageIstanbulReporter: {
            dir: 'coverage/',
            reports: ['html', 'lcov', 'text'],
            file: 'coverage.txt',
            fixWebpackSourcePaths: true
        },
        coverageReporter: {
            type: 'lcov',
            dir: 'coverage/'
        },
        reporters: ['progress', 'coverage', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['ChromeHeadless'],
        singleRun: false
    });
};