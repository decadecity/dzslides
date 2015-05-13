/*global module:false, console:false */
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // QUnit with istambul code coverage.
    qunit: {
      options: {
        coverage: {
          disposeCollector: true,
          src: [
            'src/**/*.js'
          ],
          instrumentedFiles: 'tmp/',
          htmlReport: 'report/coverage',
          linesThresholdPct: 100,
          statementsThresholdPct: 100,
          functionsThresholdPct: 100,
          branchesThresholdPct: 100
        }
      },
      files: ['test/**/*.html']
    },
    watch: {
      options: {
        // Turning spawn off allows us to use events.
        spawn: false
      },
      files: [
        'Gruntfile.js',
        'src/**/*.js',
        'test/**/*.js'
      ],
      tasks: 'default'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        loopfunc: true,
        laxbreak: true,
        globals: {
          $: true,
          jQuery: true
        }
      },
      files: [
        'Gruntfile.js',
        'src/**/*.js',
        'test/**/*.js'
      ]
    }
  });

  // For some things we want to limit the scope of the action when a file changes.
  grunt.event.on('watch', function(action, filepath) {
    if (filepath.lastIndexOf('src/js', 0) === 0) {
    console.log(filepath);
      // If it's a source file then only hint and test that file.
      grunt.config('jshint.files', filepath);
      grunt.config('qunit.files', filepath.replace(/src\/js\/(.*)$/, 'test/$1_test.html'));
      grunt.config('qunit.options.coverage.src', filepath);
    }
    if (filepath.lastIndexOf('test/', 0) === 0) {
      // If it's a test then only hint that file and run its tests.
      grunt.config('jshint.files', filepath);
      grunt.config('qunit.files', filepath.replace(/test\/(.*).js$/, 'test/$1.html'));
      grunt.config('qunit.options.coverage.src', filepath.replace(/^test\/(.*)_test.js$/, 'src/$1'));
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-qunit-istanbul');

  // Default task.
  grunt.registerTask('default', ['test', 'watch']);
  // Test task
  grunt.registerTask('test', ['jshint', 'qunit']);

};
