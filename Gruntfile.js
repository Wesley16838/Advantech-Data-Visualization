module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-execute');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.initConfig({

    clean: ["dist"],

    copy: {
      src_to_dist: {
        cwd: 'src',
        expand: true,
        src: ['**/*', '**/*.js', '!**/*.scss'],
        dest: 'dist'
      },
      img_to_dist: {
        cwd: 'src',
        expand: true,
        src: ['img/*'],
        dest: 'dist/src/'
      },
      pluginDef: {
        expand: true,
        src: ['plugin.json', 'README.md'],
        dest: 'dist',
      }
    },

    watch: {
      rebuild_all: {
        files: ['src/**/*', 'plugin.json'],
        tasks: ['default'],
        options: {
          spawn: false
        }
      },
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ["es2015"],
        plugins: ['transform-es2015-modules-systemjs', "transform-es2015-for-of"],
      },
      dist: {
        files: [{
          cwd: 'src',
          expand: true,
          src: ['*.js'],
          dest: 'dist',
          ext: '.js'
        }]
      },
    },

    cssmin: {
      options: {
        noAdvanced: true,
        sourceMap: true
      },
      files: {
        expand: true,
        cwd: 'dist/css',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css',
        ext: '.css'
      }
    },

    uglify: {
      options: {
        sourceMap: true,
        comments: 'false',
        mangle: {
          except: ['$scope', '$injector', '$rootScope']
        },
        compress: {
          // drop_console: true
        }
      },
      my_target: {
        files: [{
          expand: true,
          cwd: 'dist',
          src: ['*.js'],
          dest: 'dist',
          ext: '.js'
        }]
      },
    }
  });

  //grunt.registerTask('default', ['clean', 'copy:src_to_dist', 'copy:img_to_dist', 'copy:pluginDef', 'cssmin', 'babel']);
  grunt.registerTask('default', ['clean', 'copy:src_to_dist', 'copy:img_to_dist', 'copy:pluginDef', 'cssmin', 'babel', 'uglify']);
};