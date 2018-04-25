'use strict';

import path from 'path';
import autoprefixer from 'autoprefixer';
import px2rem from 'postcss-pxtorem';
import gulpif from 'gulp-if';
import notifier from 'node-notifier';
import c from 'chalk';
import { notification_icon_location, plugins } from '../config/shared-vars';

export default function(gulp, plugins, args, config, taskTarget, browserSync) {
  let dirs = config.directories;
  let entries = config.entries;
  let dest = path.join(taskTarget, dirs.assets, dirs.styles.replace(/^_/, ''));

  const px2rem_settings = {
    rootValue: 10,
    propWhiteList: ['font', 'font-size', 'letter-spacing'],
    replace: false,
  };

  // Sass compilation
  gulp.task('sass', () => {
    return gulp.src([
      [dirs.source, dirs.styles, entries.css].join('/')
    ])
      .pipe(plugins.plumber((error)=>{
        console.log(`\n ${c.red.bold('Sass failed to compile:')} ${c.yellow(error.message)}\n`);
        //console.error(error.stack);
        return notifier.notify({title: 'Sass Error', message: `${path.basename(error.file)} line ${error.line}`, icon: notification_icon_location+'gulp-error.png'});
      }))
      .pipe(plugins.wait(100))//Helps prevent odd file not found error
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.sassGlob())
      .pipe(plugins.sass({
        outputStyle: 'expanded',
        precision: 10,
        includePaths: [
          path.join(dirs.source, dirs.styles),
          path.join(dirs.source, dirs.modules),
          path.join('node_modules')
        ]
      }).on('error', plugins.sass.logError))
      .pipe(plugins.postcss([
        autoprefixer({browsers: ['last 2 version', '> 1%', 'ie >= 11'], grid: true }),
        px2rem(px2rem_settings)
      ]))
      .pipe(plugins.rename(function(path) {
        // Remove 'source' directory as well as prefixed folder underscores
        // Ex: 'src/_styles' --> '/styles'
        path.dirname = path.dirname.replace(dirs.source, '').replace('_', '');
      }))
      .pipe(gulpif(args.production, plugins.cssnano({rebase: false})))
      .pipe(plugins.sourcemaps.write('./'))
      .pipe(gulp.dest(dest))
      .pipe(browserSync.stream({match: '**/*.css'}));
  });
}
