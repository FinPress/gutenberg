( function () {
	const registerBlockType = fin.blocks.registerBlockType;
	const el = fin.element.createElement;
	const InnerBlocks = fin.blockEditor.InnerBlocks;
	const __ = fin.i18n.__;
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
