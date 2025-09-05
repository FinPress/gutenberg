/**
 * External dependencies
 */
// eslint-disable-next-line import/no-extraneous-dependencies
const esbuild = require( 'esbuild' );

const fpExternals = {
	name: 'finpress-externals',
	setup( build ) {
		build.onResolve(
			{ filter: /^@finpress\/(data|hooks|i18n|date)(\/|$)/ },
			( args ) => {
				// Don't bundle FinPress signleton packages
				return { path: args.path, external: true };
			}
		);
		build.onResolve( { filter: /^@finpress\// }, () => {
			// Bundle FinPress packages
			return { external: false };
		} );
		build.onResolve( { filter: /^\.[\.\/]/ }, () => {
			// Bundle relative paths
			return { external: false };
		} );
		build.onResolve( { filter: /.+/ }, ( args ) => {
			// Mark everything else as external
			return { path: args.path, external: true };
		} );
	},
};

esbuild.build( {
	entryPoints: [ 'src/index.ts' ],
	bundle: true,
	outdir: 'build-fp',
	plugins: [ fpExternals ],
	jsx: 'automatic',
	logLevel: 'info',
	format: 'esm',
} );
