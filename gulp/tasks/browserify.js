'use strict';

import path from 'path';
import glob from 'glob';
import browserify from 'browserify';
import watchifyBrowserify from 'gulp-watchify-browserify';
import envify from 'envify';
import babelify from 'babelify';
import _ from 'lodash';
import vsource from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import gulpif from 'gulp-if';
import notifier from 'node-notifier';
import c from 'chalk';

import { jsWatch, notification_icon_location, join } from '../config/shared-vars';


export default function(gulp, plugins, args, config, taskTarget, browserSync) {
  const dirs = config.directories;
  const entries = config.entries;

  const src = join('.', dirs.source, dirs.scripts, entries.js);
  const dest = join(taskTarget, dirs.assets);

  var options = {
    // watch mode
    watch: jsWatch.isEnabled,
    // set cwd to manipulate relative output path
    onError(error){
      console.log(error);
      console.log(`\n ${c.red.bold('JS failed to compile:')}\n${c.yellow(error)}\n`);
    },
    browserify: {
      entries: [
        src,
      ],
      debug: true,
      transform: [
        babelify, // Enable ES6 features
        envify // Sets NODE_ENV for better optimization of npm packages
      ],
      //allows you to import scripts without defining the path to the modules or _0_scripts folder in the import statment
      paths: [
        './node_modules',
        ['.', dirs.source, dirs.modules].join('/'),
        ['.', dirs.source, dirs.scripts].join('/'),
        './'+dirs.jsUtils
      ],
      cache: {},
      packageCache: {},
    }
  };

  function rebundle (done) {

    return watchifyBrowserify(src, options, streamHandler.bind(this), done);

    function streamHandler(stream){

      let startTime = new Date().getTime();

      const file = src;

      return stream
      .pipe(plugins.sourcemaps.init({loadMaps: true}))
        .pipe(plugins.if(args.production, plugins.uglify()))
        .pipe(plugins.rename(function(filepath) {
          //Sends all output files to the scripts folder
          filepath.dirname = join(dirs.assets, dirs.scripts.replace(/^_[0-9]_/,''));
        }))
      .pipe(plugins.sourcemaps.write('./'))
      .pipe(gulp.dest(dest))
      // Show which file was bundled and how long it took
      .on('end', function() {

        if (!hasError){
          let time = (new Date().getTime() - startTime) / 1000;

          console.log(
            c.cyan(file)
            + ' was browserified: '
            + c.magenta(time + ' s'));

          const fileInfo = file.split('\\');
          const fileName = valueAt(fileInfo, -1);
          const filePath = file.replace(dirs.source,'').replace(fileName, '').replace(/^[\\]|[\\]$/g,'');

          //Use jsWatch.disable in gulp.series to prevent file reloads
          //Don't forget to re-enable it again though with jsWatch.enable
          if (jsWatch.isEnabled) browserSync.reload('*.js');
        }

        hasError = false;
      });
    }
  };

  // Browserify Task
  gulp.task('browserify', gulp.series(jsWatch.enable, rebundle));
}
