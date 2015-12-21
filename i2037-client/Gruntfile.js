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

  grunt.config.set('dir.dist', 'build');

  grunt.registerTask('build', ['clean', 'jshint', 'html2js', 'copy', 'preprocess', 'ts', 'sass', 'concat', 'karma:unit']);
  grunt.registerTask('release', ['env:release', 'build', 'uglify']);
  grunt.registerTask('default', ['env:dev', 'build']);

  var karmaConfig = function(configFile, customOptions) {
    var options = { configFile: configFile, keepalive: true };
    var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'], reporters: 'dots' };
    return grunt.util._.extend(options, customOptions, travisOptions);
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // i2037 dir 
    dir: {
      dist: 'build',
      bower: 'bower_components'
    },
    clean: [ 'build/**' ],
    concat: {
      app: {
        src: ['<%= dir.dist %>/js/**/*.js'],
        dest: '<%= dir.dist %>/js/<%= pkg.name %>.js'
      },
      angular: {
        src: [
          '<%= dir.bower %>/angular/angular.js',
          '<%= dir.bower %>/angular-route/angular-route.js',
          '<%= dir.bower %>/angular-resource/angular-resource.js',
          '<%= dir.bower %>/angular-bootstrap/ui-bootstrap-tpls.js',
          '<%= dir.bower %>/angular-ui-calendar/src/calendar.js'
        ],
        dest: '<%= dir.dist %>/lib/angular.js'
      },
      jquery: {
        src: [
          '<%= dir.bower %>/jquery/jquery.js',
          '<%= dir.bower %>/jquery.cookie/jquery.cookie.js'
        ],
        dest: '<%= dir.dist %>/lib/jquery.js'
      },
      depsjs: {
        src: [
          '<%= dir.bower %>/spinjs/spin.js',
          '<%= dir.bower %>/fullcalendar/fullcalendar.js',
          '<%= dir.bower %>/d3/d3.js',
          '<%= dir.bower %>/autofill-event/src/autofill-event.js'
        ],
        dest: '<%= dir.dist %>/lib/deps.js'
      }
    },
    copy: {
      static: {
        files: [
          {expand: true, cwd: 'app', src: ['img/**'], dest: '<%= dir.dist %>/'},
          {expand: true, cwd: 'app', src: ['partials/**'], dest: '<%= dir.dist %>/'},
          {expand: true, cwd: 'app', src: ['css/**'], dest: '<%= dir.dist %>/'}
        ]
      },
      bootstrap: {
        files: [
          {expand: true, cwd: '<%= dir.bower %>/bootstrap/dist', src: ['css/**'], dest: '<%= dir.dist %>/'},
          {expand: true, cwd: '<%= dir.bower %>/bootstrap/dist', src: ['fonts/**'], dest: '<%= dir.dist %>/'},
          {expand: true, cwd: '<%= dir.bower %>/bootstrap/dist/js', src: ['**'], dest: '<%= dir.dist %>/lib/'}
        ]
      },
      calendar: {
        files: [
          {expand: true, cwd: '<%= dir.bower %>/fullcalendar', src: ['*.css'], dest: '<%= dir.dist %>/css'}
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
          base: 'app/js'
        },
        src: ['app/**/*.tpl.html'],
        dest: '<%= dir.dist %>/js/templates/<%= pkg.name %>.tpl.js',
        module: 'templates.app'
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
          options: {
            context: {
              name: '<%= pkg.name %>',
              now: '<%= now %>'
            }
          },
          files: [
            {'<%= dir.dist %>/index.html': 'app/index.html' },
            { expand:true, cwd: 'app/js', src:'**/*.js', dest: '<%= dir.dist %>/js/'},
            { expand:true, cwd: 'app/js', src:'**/*.ts', dest: '<%= dir.dist %>/js/'}
          ]          
        }
    },
    sass: {
      dist: {
        files: {
          '<%= dir.dist %>/css/app.css': 'app/css/app.scss'
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
        src: ['<%= dir.dist %>/js/<%= pkg.name %>.js'],
        dest: '<%= dir.dist %>/js/<%= pkg.name %>.min.js' 
      },
      angular: {
        src: ['<%= concat.angular.src %>'],
        dest: '<%= dir.dist %>/lib/angular.min.js'
      },
      jquery: {
        src: [ '<%= concat.jquery.src %>'],
        dest: '<%= dir.dist %>/lib/jquery.min.js'
      },
      depsjs: {
        src: [ '<%= concat.depsjs.src %>' ],
        dest: '<%= dir.dist %>/lib/deps.min.js'
      }          
    },
    watch: {
      files: ['Gruntfile.js', 'app/**/*.ts', 'test/unit/**/*.js', 'app/**/*.html', 'app/**/*.scss'],
      tasks: ['build']
    }
  });
};