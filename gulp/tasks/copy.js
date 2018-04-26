'use strict';

import path from 'path';
import { join } from '../config/shared-vars';

export default function(gulp, plugins, args, config, taskTarget, browserSync) {
  let dirs = config.directories;
  let dest = join(taskTarget);

  gulp.task('copy:icomoon', () => {
    return gulp.src([
      join(dirs.source, '_icomoon/fonts/**/*'),
    ])
    .pipe(gulp.dest(join(taskTarget, dirs.assets, 'icomoon')));
  });

  // Copy
  gulp.task('copy', gulp.parallel('copy:icomoon', () => {
    return gulp.src([
      join(dirs.source, '**/*'),
      '!' + join(dirs.source, '{**/\_*,**/\_*/**}'),
      '!' + join(dirs.source, '**/*.pug')
    ])
    .pipe(plugins.changed(dest))
    .pipe(gulp.dest(dest));
  }));
}
