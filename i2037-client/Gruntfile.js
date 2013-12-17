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

  grunt.registerTask('config_dev', 'Prepare for dev build', function() {
    grunt.config.set('dir.dist', 'build/dev');
  });

  grunt.registerTask('config_release', 'Prepare for release build', function() {
    grunt.config.set('dir.dist', 'build/release');
  });
  
  grunt.registerTask('build', ['clean', 'jshint', 'html2js', 'config_dev', 'env:dev', 'copy', 'preprocess', 'concat']);
  grunt.registerTask('release', ['build', 'config_release', 'env:release', 'copy', 'preprocess', 'uglify']);
  grunt.registerTask('default', ['build', 'karma:unit']);

  var karmaConfig = function(configFile, customOptions) {
    var options = { configFile: configFile, keepalive: true };
    var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'], reporters: 'dots' };
    return grunt.util._.extend(options, customOptions, travisOptions);
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // i2037 dir 
    dir: {
      dist: 'build/dev',
      tmp: 'build/tmp',
      bower: 'bower_components',
    },
    clean: [ 'build/**' ],
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
    copy: {
      static: {
        files: [
          {expand:true, cwd: 'app', src:['img/**'], dest: '<%= dir.dist %>/'},
          {expand:true, cwd: 'app', src:['partials/**'], dest: '<%= dir.dist %>/'},
          {expand:true, cwd: 'app', src:['css/**'], dest: '<%= dir.dist %>/'},          
        ]
      },
    },
    html2js: {
      app: {
        options: {
          base: 'app/js'
        },
        src: ['app/**/*.tpl.html'],
        dest: '<%= dir.tmp %>/templates/app.js',
        module: 'templates.app'
      }
    },        
    preprocess: {
        app: {
          options: {
            context: {
              name: '<%= pkg.name %>',
              now: '<%= now %>',
            }
          },
          files: [
            {'<%= dir.dist %>/index.html': 'app/index.html' },
            { expand:true, cwd: 'app/js', src:'**/*.js', dest: '<%= dir.tmp %>/js/dev/'} 
          ]          
        }
    },        
    concat: {
      options: {
        separator: ';'
      },
      app: {
        src:  ['<%= dir.tmp %>/js/dev/**/*.js', '<%= dir.tmp %>/templates/app.js'], 
        dest: '<%= dir.dist %>/js/dev/<%= pkg.name %>.js'
      },
      angular: {
        src:[ 
          '<%= dir.bower %>/angular/angular.js', 
          '<%= dir.bower %>/angular-route/angular-route.js',
          '<%= dir.bower %>/angular-resource/angular-resource.js',
          '<%= dir.bower %>/angular-cookies/angular-cookies.js',          
          '<%= dir.bower %>/angular-bootstrap/ui-bootstrap-tpls.js'
        ],
        dest: '<%= dir.dist %>/js/angular.js'
      },
      jquery: {
        src: [
          '<%= dir.bower %>/jquery/jquery.js',
          '<%= dir.bower %>/jquery.cookie/jquery.cookie.js'          
        ],
        dest: '<%= dir.dist %>/js/jquery.js'
      },
      spinjs: {
        src: [ '<%= dir.bower %>/spinjs/spin.js' ],
        dest: '<%= dir.dist %>/js/spin.js'
      },
      bootstrap: {
        src: [ 
          '<%= dir.bower %>/bootstrap/js/bootstrap-modal.js',
          '<%= dir.bower %>/bootstrap/js/bootstrap-typeahead.js',
          '<%= dir.bower %>/bootstrap/js/bootstrap-collapse.js',
          '<%= dir.bower %>/bootstrap/js/bootstrap-transition.js',          
        ],
        dest: '<%= dir.dist %>/js/bootstrap.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      app: {
        src: ['<%= concat.app.src %>'],
        dest: '<%= dir.dist %>/js/<%= pkg.version %>/<%= pkg.name %>.min.js' 
      },
      angular: {
        src: ['<%= concat.angular.src %>'],
        dest: '<%= dir.dist %>/js/angular.min.js'
      },
      jquery: {
        src: [ '<%= concat.jquery.src %>'],
        dest: '<%= dir.dist %>/js/jquery.min.js'
      },
      spinjs: {
        src: [ '<%= concat.spinjs.src %>' ],
        dest: '<%= dir.dist %>/js/spin.min.js'
      },
      bootstrap: {
        src: [ '<%= concat.bootstrap.src %>'],
        dest: '<%= dir.dist %>/js/bootstrap.min.js'
      }            
    },
    karma: {
      unit: { options: karmaConfig('config/karma.conf.js', { singleRun:true, autoWatch: false}) },
      watch: { options: karmaConfig('config/karma.conf.js', { singleRun:false, autoWatch: true}) }
    },    
    jshint: {
      files: ['Gruntfile.js', 'app/**/*.js'],
      options:{
        curly:true,
        eqeqeq:true,
        immed:true,
        latedef:true,
        newcap:true,
        noarg:true,
        sub:true,
        boss:true,
        eqnull:true,
        globals:{}
      }      
    },
    watch: {
      files: ['Gruntfile.js', 'app/**/*.js', 'test/unit/**/*.js', 'app/**/*.html'],
      tasks: ['build']
    }
  });
};