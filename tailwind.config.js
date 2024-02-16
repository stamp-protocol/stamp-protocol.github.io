module.exports = {
	content: [
		'dist/**/*.html',
	],
	//purge: [
	//	'**/*.html',
	//	'**/*.js',
	//],
	theme: {
		extend: {
			colors: {
				'ink': '#111',
				'primary': '#6a803c',
                'secondary': '#dfe',
				'link': '#c22',
				'linkvisited': '#8a1717',
			},
			fontFamily: {
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};

