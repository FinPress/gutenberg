module.exports = ( api ) => {
	api.cache( true );

	return {
		presets: [ '@finpress/babel-preset-default' ],
	};
};
