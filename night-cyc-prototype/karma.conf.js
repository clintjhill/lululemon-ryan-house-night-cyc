module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    reporters: ['spec'],
    browsers: ['PhantomJS'],
    files: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
      'node_modules/parse/dist/parse-latest.js',
      'src/assets/js/vendor/accounting.js',
      'src/assets/js/vendor/stripe.js',
      'src/assets/js/app.js',
      'src/spec/**/*.js'
    ]
  });
};
