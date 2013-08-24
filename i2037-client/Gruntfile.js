module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // i2037 dirs 
    dirs: {
      dev: 'build/dev',
      release: 'build/release',
      tmp: 'build/tmp'
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
      dev: {
        files: [
          {expand:true, cwd: 'app', src:['lib/**'], dest: '<%= dirs.dev %>/'},
          {expand:true, cwd: 'app', src:['img/**'], dest: '<%= dirs.dev %>/'},
          {expand:true, cwd: 'app', src:['partials/**'], dest: '<%= dirs.dev %>/'},
          {expand:true, cwd: 'app', src:['css/**'], dest: '<%= dirs.dev %>/'},          
        ]
      },
      release: {
        files: [
          {expand:true, cwd: 'app', src:['lib/**'], dest: '<%= dirs.release %>/'},
          {expand:true, cwd: 'app', src:['img/**'], dest: '<%= dirs.release %>/'},
          {expand:true, cwd: 'app', src:['partials/**'], dest: '<%= dirs.release %>/'},
          {expand:true, cwd: 'app', src:['css/**'], dest: '<%= dirs.release %>/'},          
        ]
      }      
    },
    preprocess: {
        dev: {
          files: [
            { '<%= dirs.dev %>/index.html' : 'app/index.html' },
            { expand:true, cwd: 'app/js', src:'**/*.js', dest: '<%= dirs.tmp %>/js/dev/'} 
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
              {'<%= dirs.release %>/index.html': 'app/index.html' },
              { expand:true, cwd: 'app/js', src:'**/*.js', dest: '<%= dirs.tmp %>/js/<%= pkg.version %>/'} 
            ]          
        }
    },        
    concat: {
      options: {
        separator: ';'
      },
      dev: {
        src:'<%= dirs.tmp %>/js/dev/**/*.js', 
        dest: '<%= dirs.dev %>/js/dev/<%= pkg.name %>.js'
      },
      release: {
        src:'<%= dirs.tmp %>/js/<%= pkg.version %>/**/*.js', 
        dest: '<%= dirs.release %>/js/<%= pkg.version %>/<%= pkg.name %>.js'        
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dev: {
        files: {
          '<%= dirs.dev %>/js/dev/<%= pkg.name %>.min.js': ['<%= concat.dev.dest %>']
        }
      },
      release: {
        files: {
          'build/release/js/<%= pkg.version %>/<%= pkg.name %>.min.js': ['<%= concat.release.dest %>']
        }
      }      
    },
    jshint: {
      files: ['Gruntfile.js', '<%= concat.dev.dest %>'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['Gruntfile.js', 'app/**/*.js', 'app/**/*.html'],
      tasks: ['env:dev', 'copy:dev', 'preprocess:dev', 'concat:dev']
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
  
  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('default', ['clean', 'env:dev', 'copy:dev', 'preprocess:dev', 'concat:dev', 'uglify:dev']);
  grunt.registerTask('release', ['default', 'env:release', 'copy:release', 'preprocess:release', 'concat:release', 'uglify:release']);
};