module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-sass');

  grunt.registerTask('build', ['clean', 'jshint', 'copy', 'preprocess', 'ts', 'html2js', 'sass', 'concat', 'karma:unit']);
  grunt.registerTask('release', ['env:release', 'build', 'uglify']);
  grunt.registerTask('default', ['env:dev', 'build']);

  var karmaConfig = function(configFile, customOptions) {
    var options = { configFile: configFile, keepalive: true };
    var travisOptions = process.env.JENKINS_HOME && { browsers: ['Firefox'], reporters: 'dots' };
    return grunt.util._.extend(options, customOptions, travisOptions);
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // i2037 dir 
    dir: {
      dist: 'build',
      bower: 'bower_components',
      node: 'node_modules'
    },
    clean: [ 'build/**' ],
    concat: {
      app: {
        src: ['<%= dir.dist %>/app/js/**/*.js'],
        dest: '<%= dir.dist %>/app/js/<%= pkg.name %>.js'
      },
      angular: {
        src: [
          '<%= dir.bower %>/angular/angular.js',
          '<%= dir.bower %>/angular-route/angular-route.js',
          '<%= dir.bower %>/angular-resource/angular-resource.js',
          '<%= dir.bower %>/angular-bootstrap/ui-bootstrap-tpls.js',
          '<%= dir.bower %>/angular-ui-calendar/src/calendar.js'
        ],
        dest: '<%= dir.dist %>/app/lib/angular.js'
      },
      angular2: {
        src: [
          '<%= dir.node %>/systemjs/dist/system.src.js',
          '<%= dir.node %>/es6-shim/es6-shim.js',
          '<%= dir.node %>/es6-promise/dist/es6-promise.js',
          '<%= dir.node %>/angular2/bundles/angular2-polyfills.js',
          '<%= dir.node %>/angular2/bundles/angular2.dev.js',
          '<%= dir.node %>/angular2/bundles/upgrade.dev.js',
          '<%= dir.node %>/rxjs/bundles/Rx.js'
        ],
        dest: '<%= dir.dist %>/app/lib/angular2.js'
      },
      jquery: {
        src: [
          '<%= dir.bower %>/jquery/jquery.js',
          '<%= dir.bower %>/jquery.cookie/jquery.cookie.js'
        ],
        dest: '<%= dir.dist %>/app/lib/jquery.js'
      },
      depsjs: {
        src: [
          '<%= dir.bower %>/spinjs/spin.js',
          '<%= dir.bower %>/fullcalendar/fullcalendar.js',
          '<%= dir.bower %>/d3/d3.js',
          '<%= dir.bower %>/autofill-event/src/autofill-event.js'
        ],
        dest: '<%= dir.dist %>/app/lib/deps.js'
      },
      systemjs: {
        src: [
          '<%= dir.node %>/systemjs/dist/system.src.js'
        ],
        dest: '<%= dir.dist %>/app/lib/system.js'
      }
    },
    copy: {
      app: {
        files: [
          {expand: true, cwd: '.', src: ['app/img/**'],    dest: '<%= dir.dist %>'},
          {expand: true, cwd: '.', src: ['app/**/*.html'], dest: '<%= dir.dist %>'},
          {expand: true, cwd: '.', src: ['app/**/*.css'],  dest: '<%= dir.dist %>'},
          {expand: true, cwd: '.', src: ['app/**/*.scss'], dest: '<%= dir.dist %>'},
          {expand: true, cwd: '.', src: ['app/**/*.js'],   dest: '<%= dir.dist %>'},
          {expand: true, cwd: '.', src: ['app/**/*.ts'],   dest: '<%= dir.dist %>'}
        ]
      },
      tests: {
        files: [
          {expand: true, cwd: '.', src: ['test/unit/**/*.js'], dest: '<%= dir.dist %>/'},
          {expand: true, cwd: '.', src: ['test/unit/**/*.ts'], dest: '<%= dir.dist %>/'}
        ]
      },
      bootstrap: {
        files: [
          {expand: true, cwd: '<%= dir.bower %>/bootstrap/dist', src: ['css/**'],   dest: '<%= dir.dist %>/app/'},
          {expand: true, cwd: '<%= dir.bower %>/bootstrap/dist', src: ['fonts/**'], dest: '<%= dir.dist %>/app/'},
          {expand: true, cwd: '<%= dir.bower %>/bootstrap/dist/js', src: ['**'],    dest: '<%= dir.dist %>/app/lib/'}
        ]
      },
      calendar: {
        files: [
          {expand: true, cwd: '<%= dir.bower %>/fullcalendar', src: ['*.css'], dest: '<%= dir.dist %>/app/css'}
        ]
      }
    },
    env: {
      dev: {
          NODE_ENV : 'DEV',
          i2037_SVC_PREFIX: '/i2037-webapp',
          i2037_VERSION: 'dev'
      },
      release : {
          NODE_ENV : 'PROD',
          i2037_SVC_PREFIX: '',
          i2037_VERSION: '<%= pkg.version %>'
      }
    },
    html2js: {
      app: {
        options: {
          base: '<%= dir.dist %>/app'
        },
        src: ['<%= dir.dist %>/app/**/*.tpl.html'],
        dest: '<%= dir.dist %>/app/js/templates/<%= pkg.name %>.tpl.js',
        module: 'i2037.templates'
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'app/**/*.js'],
      options: {
        debug: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true,
        globals: {}
      }
    },
    karma: {
      unit: {configFile: 'config/karma.conf.js', singleRun: true, autoWatch: false},
      watch: {configFile: 'config/karma.conf.js', singleRun: false, autoWatch: true}
    },
    preprocess: {
        app: {
          src: [ '<%= dir.dist %>/app/index.html' ],
          options: {
            inline: true,
            context: {
              name: '<%= pkg.name %>',
              now: '<%= now %>'
            }
          }
        }
    },
    sass: {
      dist: {
        files: {
          '<%= dir.dist %>/app/css/app.css': '<%= dir.dist %>/app/css/app.scss'
        }
      }
    },
    ts: {
      default: {
        tsconfig: true
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      app: {
        src: ['<%= dir.dist %>/app/js/<%= pkg.name %>.js'],
        dest: '<%= dir.dist %>/app/js/<%= pkg.name %>.min.js'
      },
      angular: {
        src: ['<%= concat.angular.src %>'],
        dest: '<%= dir.dist %>/app/lib/angular.min.js'
      },
      angular2: {
        src: ['<%= concat.angular2.src %>'],
        dest: '<%= dir.dist %>/app/lib/angular2.min.js'
      },
      jquery: {
        src: [ '<%= concat.jquery.src %>'],
        dest: '<%= dir.dist %>/app/lib/jquery.min.js'
      },
      depsjs: {
        src: [ '<%= concat.depsjs.src %>' ],
        dest: '<%= dir.dist %>/app/lib/deps.min.js'
      },
      systemjs: {
        src: ['<%= concat.systemjs.src %>'],
        dest: '<%= dir.dist %>/app/lib/system.min.js'
      }
    },
    watch: {
      files: ['Gruntfile.js', 'app/**/*.ts', 'test/unit/**/*.js', 'app/**/*.html', 'app/**/*.scss'],
      tasks: ['build']
    }
  });
};