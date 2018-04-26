'use strict';

import path from 'path';

import { jsWatch, join } from '../config/shared-vars';


export default function(gulp, plugins, args, config, taskTarget, browserSync) {
  let dirs = config.directories;

  // Watch task
  gulp.task('watch', gulp.parallel('browserSync', (done) => {

    jsWatch.isEnabled = true;
    jsWatch.calledFromWatch = true;

    // Styles
    gulp.watch([
      join('*.{scss,sass}'),
      join(dirs.source, dirs.styles, '**/*.{scss,sass}'),
      join(dirs.source, dirs.modules, '**/*.{scss,sass}')
    ])
    .on('change', gulp.series('sass'));

    // Scripts (watchify takes over, this is just to get the ball rolling)
    gulp.watch([
      join(dirs.source, '**/*.js'),
    ])
    .on('change', gulp.series('browserify'));

    // Jade Templates
    gulp.watch([
      join(dirs.source, '**/*.pug'),
      join(dirs.source, dirs.data, '**/*.{json,yaml,yml}')
    ])
    .on('change', gulp.series('pug:compile'));

    // Copy
    gulp.watch([
      join(dirs.source, '**/*'),
      '!' + join(dirs.source, '{**/\_*,**/\_*/**}'),
      '!' + join(dirs.source, '**/*.pug')
    ])
    .on('change', gulp.series('copy'));

    // Images
    gulp.watch([
      join(dirs.source, dirs.images, '**/*.{jpg,jpeg,gif,svg,png}')
    ])
    .on('change', gulp.parallel('imagemin', 'pug'));

    // All other files
    gulp.watch([
      join(dirs.temporary, '**/*'),
      '!' + join(dirs.temporary, '**/*.{css,map,html,js}')
    ]).on('change', browserSync.reload);

    done();
  }));
}
