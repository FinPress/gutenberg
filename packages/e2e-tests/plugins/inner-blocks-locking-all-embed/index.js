( function () {
	const registerBlockType = fp.blocks.registerBlockType;
	const el = fp.element.createElement;
	const InnerBlocks = fp.blockEditor.InnerBlocks;
	const __ = fp.i18n.__;
	const TEMPLATE = [
		[
			'core/paragraph',
			{
				fontSize: 'large',
				content: __( 'Content…' ),
			},
		],
		[ 'core/embed' ],
	];

	const save = function () {
		return el( InnerBlocks.Content );
	};

	registerBlockType( 'test/test-inner-blocks-locking-all-embed', {
		title: 'Test Inner Blocks Locking All Embed',
		icon: 'cart',
		category: 'text',

		edit() {
			return el( InnerBlocks, {
				template: TEMPLATE,
				templateLock: 'all',
			} );
		},

		save,
	} );
} )();
