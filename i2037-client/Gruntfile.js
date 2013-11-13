module.exports = function(grunt) {
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
    preprocess: {
        dev: {
          files: [
            { '<%= dir.dist %>/index.html' : 'app/index.html' },
            { expand:true, cwd: 'app/js', src:'**/*.js', dest: '<%= dir.tmp %>/js/dev/'} 
          ]
        },
        release: {
          options: {
            context: {
              name: '<%= pkg.name %>',
              now: '<%= now %>',
            }
          },
          files: [
            {'<%= dir.dist %>/index.html': 'app/index.html' },
            { expand:true, cwd: 'app/js', src:'**/*.js', dest: '<%= dir.tmp %>/js/<%= pkg.version %>/'} 
          ]          
        }
    },        
    concat: {
      options: {
        separator: ';'
      },
      app: {
        src:  '<%= dir.tmp %>/js/dev/**/*.js', 
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
          '<%= dir.bower %>/bootstrap/js/bootstrap-typeahead.js'
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
      // release: {
      //   src: ['<%= concat.dev.src %>'],
      //   dest: '<%= dir.release %>/<%= pkg.version %>/<%= pkg.name %>.min.js'
      // },
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
      files: ['Gruntfile.js', 'app/**/*.js', 'app/**/*.html'],
      tasks: ['jshint', 'config_dev', 'env:dev', 'copy', 'preprocess:dev', 'concat']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-env');

  grunt.registerTask('config_dev', 'Prepare for dev build', function() {
    grunt.config.set('dir.dist', 'build/dev');
  });

  grunt.registerTask('config_release', 'Prepare for release build', function() {
    grunt.config.set('dir.dist', 'build/release');
  });
  
  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('default', ['clean', 'config_dev', 'env:dev', 'copy', 'preprocess:dev', 'concat']);
  grunt.registerTask('release', ['default', 'config_release', 'env:release', 'copy', 'preprocess:release', 'uglify']);
};