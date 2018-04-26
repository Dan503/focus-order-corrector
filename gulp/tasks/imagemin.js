'use strict';

import path from 'path';
import gulpif from 'gulp-if';
import { join } from '../config/shared-vars';

export default function(gulp, plugins, args, config, taskTarget, browserSync) {
  let dirs = config.directories;
  let dest = join(taskTarget, dirs.assets, dirs.images.replace(/^_/, ''));

  // Imagemin
  gulp.task('imagemin', () => {
    return gulp.src(join(dirs.source, dirs.images, '**/*.{jpg,jpeg,gif,svg,png}'))
      // .pipe(plugins.changed(dest))
      // .pipe(gulpif(args.production, plugins.imagemin({
      //   progressive: true,
      //   svgoPlugins: [{removeViewBox: false}],
      //   use: [pngquant({speed: 10})]
      // })))
      .pipe(gulp.dest(dest));
  });
}
