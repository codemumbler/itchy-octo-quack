module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'js/lib/*.js',
      'js/main.js',
      'js/*.js',
      'test/lib/*.js',
      'test/testcommon.js',
      'test/*.Spec.js'
    ],
    exclude: [],
    preprocessors: {
      'js/*.js': ['coverage']
    },
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Firefox'],
    singleRun: false
  });
};
