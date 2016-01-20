'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*\n *  <%= pkg.name %> v<%= pkg.version %>\n' +
        '<%= pkg.homepage ? " *  " + pkg.homepage + "\\n" : "" %>' +
        ' *  Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      dist: [
        'lib/index.js'
      ]
    },
    concat: {
      dist: {
        files: {
          'dist/es6-module-loader.src.js': [
            'node_modules/when/es6-shim/Promise.js',
            'src/polyfill-wrapper-start.js',
            'dist/es6-module-loader.js',
            'src/polyfill-wrapper-end.js'
          ],
          'dist/es6-module-loader-sans-promises.src.js': [
            'src/polyfill-wrapper-start.js',
            'dist/es6-module-loader.js',
            'src/polyfill-wrapper-end.js'
          ]
        }
      }
    },
    esnext: {
      dist: {
        src: [
          'src/loader.js',
          'src/transpiler.js',
          'src/system.js'
        ],
        dest: 'dist/es6-module-loader.js'
      }
    },
    'string-replace': {
      dist: {
        files: {
          'dist/es6-module-loader.js': 'dist/es6-module-loader.js'
        },
        options: {
          replacements:[{
            pattern: 'var $__Object$getPrototypeOf = Object.getPrototypeOf;\n' +
              'var $__Object$defineProperty = Object.defineProperty;\n' +
              'var $__Object$create = Object.create;',
            replacement: ''
          }, {
            pattern: '$__Object$getPrototypeOf(SystemLoader.prototype).constructor',
            replacement: '$__super'
          }]
        }
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>\n',
        compress: {
          drop_console: true
        },
        sourceMap: true
      },
      dist: {
        options: {
          banner: '<%= meta.banner %>\n'
        },
        src: 'dist/es6-module-loader.src.js',
        dest: 'dist/es6-module-loader.js'
      },
      distSansPromises: {
        src: 'dist/es6-module-loader-sans-promises.src.js',
        dest: 'dist/es6-module-loader-sans-promises.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-esnext');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-string-replace');

  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('compile', ['esnext', 'string-replace', 'concat']);
  grunt.registerTask('default', [/*'jshint', */'esnext', 'string-replace',
                     'concat', 'uglify']);
};
