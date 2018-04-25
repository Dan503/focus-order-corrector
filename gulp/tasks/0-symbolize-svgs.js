'use strict';

import c from 'chalk';

export default function(gulp, plugins, args, config, taskTarget, browserSync) {
  const dirs = config.directories;
	const dest = dirs.temporary;
	const finalDest = [dest, 'svg-symbols.svg'].join('/');

	gulp.task('symbolize-svgs', (done)=>{

    //letting the user know what is going on
		console.log(`
${c.bold('Generated SVG sprite')}

Converted svgs from here: ${c.yellow([dirs.source, dirs.images, 'SVGs'].join('/'))}
Into an svg sprite that can be found here: ${c.yellow(finalDest)}
Full SVGs are still available here: ${c.yellow([taskTarget, config.basePath, dirs.assets, dirs.images.replace(/^_/, ''), 'SVGs'].join('/'))}

Use an SVG from the sprite by using ${c.green('+svg("svg-file-name")')} in your pug files
`);

	  return gulp.src([dirs.source, dirs.images, 'SVGs', '**/*.svg'].join('/'))

	  	//convert svg files in "SVGs" folder into a single svg sprite
	    .pipe(plugins.svgSymbols({
	    	id: 'svg-%f',
	    	title: '%f icon',//default title can be overidden by providing a title in the svg
	    }))

			//minify the svg if in production mode
			// .pipe(plugins.if(args.production, plugins.imagemin({
			// 	progressive: true,
			// 	svgoPlugins: [
			// 		{removeViewBox: false},
			// 		{cleanupIDs: false},
			// 	],
			// })))
			.pipe(gulp.dest(dest));

	});
}
