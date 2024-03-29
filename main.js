const Metalsmith = require('metalsmith');
const collections = require('@metalsmith/collections');
const layouts = require('@metalsmith/layouts');
const inplace = require('@metalsmith/in-place');
const markdown = require('@metalsmith/markdown');
const permalinks = require('@metalsmith/permalinks');
const remove = require('@metalsmith/remove');
const post_dates = require('./plugins/post_dates');
const post_permalink = require('./plugins/post_permalink');
const rss = require('./plugins/rss');
const sass = require('./plugins/sass');
const page_ref = require('./plugins/page_ref');
const toc = require('./plugins/toc');

const SRC = process.env['SRC'] || 'src';
const DEST = process.env['DEST'] || 'dist';
const URL = process.env['URL'] || 'https://stamp-protocol.github.io';
const DRAFTS = process.env['DRAFTS'] === '1';

const NUNJUCK_OPTS = {
	autoescape: false,
	root: `${__dirname}/${SRC}`,
};

Metalsmith(__dirname)
	.metadata({
		site: {
			url: URL,
			base: '',
			title: 'Stamp',
			description: 'A cryptographic identity system',
			asset_version: 14,
		},
	})
	.source(`${SRC}/`)
	.destination(`${DEST}/`)
	.clean(true)
	// we never process these directly, so no point in having them LOL
	.use(remove([
		'layouts/**/*',
		'includes/**/*',
		'css/includes/**/*',
        // metalsmith parses this as one giant front matter file, so we ignore and solve in the Makefile...
        'assets/andrew.stamp',
        'assets/zefram.stamp',
	]))
	// deal with drafts
	.use((files, metalsmith, done) => {
		if(!DRAFTS) {
			const fn = remove([
				'drafts/**/*',
			]);
			return fn(files, metalsmith, done);
		} else {
			return done();
		}
	})
	.use((files) => {
		Object.keys(files).forEach((path) => {
			if(path.indexOf('drafts/') === 0) {
				const newpath = path.replace(/drafts\//, 'posts/');
				files[newpath] = files[path];
				delete files[path];
			}
		});
	})

	// -------------------------------------------------------------------------
	// setup and metadata
	// -------------------------------------------------------------------------

	.use(page_ref())
	.use(post_dates({
		pattern: ['posts/**/*.md', 'posts/**/*.md.njk'],
	}))
	.use(post_permalink({
		pattern: ['posts/**/*.md', 'posts/**/*.md.njk'],
	}))
	.use(collections({
		docs: {
			pattern: ['docs/**/*.njk'],
            sortBy: (a, b) => a.sort - b.sort,
		},
		posts: {
			pattern: ['posts/**/*.md', 'posts/**/*.md.njk'],
			sortBy: function(a, b) {
				return new Date(b.date) - new Date(a.date);
			},
		},
	}))

	// -------------------------------------------------------------------------
	// rendering
	// -------------------------------------------------------------------------

	// render posts first, so they can be templated into other pages (index/news)
	.use(inplace({
        transform: 'nunjucks',
		engineOptions: NUNJUCK_OPTS,
		pattern: ['posts/**/*.njk'],
	}))
	.use(markdown({gfm: true, tables: true}))
	// now render everything else
	.use(inplace({
        transform: 'nunjucks',
		engineOptions: NUNJUCK_OPTS,
		pattern: ['**/*.njk'],
	}))
	.use(markdown({gfm: true, tables: true}))
	// rss happens before layouts so we have access to post content WITHOUT all
	// the HTML gibberish
	.use(function(files, metalsmith, done) {
		const meta = metalsmith._metadata;
		return rss({feedOptions: {...meta.site, site_url: meta.site.url}, destination: 'feed.xml'})(files, metalsmith, done);
	})
	// table of contents (use `generate_toc: true` in front matter)
	.use(toc())
	// layouts are last in the rendering
	.use(layouts({
		engineOptions: NUNJUCK_OPTS,
		pattern: ['**/*.html'],
		directory: `${SRC}/layouts`,
	}))

	// -------------------------------------------------------------------------
	// post-render
	// -------------------------------------------------------------------------

	.use(permalinks({
		relative: false,
	}))
	.use(sass({pattern: ['css/**/*.scss']}))
	.build((err) => {
		if(err) throw err;
	});

