'use strict';

import path from 'path';
import glob from 'glob';
import envify from 'envify';
import babelify from 'babelify';
import _ from 'lodash';
import vsource from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import gulpif from 'gulp-if';
import notifier from 'node-notifier';
import c from 'chalk';
import rollup from 'gulp-rollup';
import { jsWatch, notification_icon_location, join } from '../config/shared-vars';


export default function(gulp, plugins, args, config, taskTarget, browserSync) {
  const dirs = config.directories;
  const entries = config.entries;

  const src = join('.', dirs.source, dirs.scripts, entries.js);
  const dest = join(taskTarget, dirs.assets);

  function rebundle(done) {
    return gulp.src('./src/**/*.js')
      .pipe(plugins.sourcemaps.init())
        // transform the files here.
        .pipe(rollup({
          input: src,
          output: {format: 'umd'}
        }))
      .pipe(plugins.sourcemaps.write())
      .pipe(gulp.dest(dest));
  }

  // JS compile Task
  gulp.task('js', gulp.series(jsWatch.enable, rebundle));
}
