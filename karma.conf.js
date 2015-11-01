module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'js/lib/*.js',
      'js/*.js',
      'test/lib/*.js',
      'test/*.Spec.js'
    ],
    exclude: [],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Firefox'],
    singleRun: false
  });
};
