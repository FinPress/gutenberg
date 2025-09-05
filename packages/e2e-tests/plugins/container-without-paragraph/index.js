( function () {
	fp.blocks.registerBlockType( 'test/container-without-paragraph', {
		title: 'Container without paragraph',
		category: 'text',
		icon: 'yes',

		edit() {
			return fp.element.createElement( fp.blockEditor.InnerBlocks, {
				allowedBlocks: [ 'core/image', 'core/gallery' ],
			} );
		},

		save() {
			return fp.element.createElement(
				fp.blockEditor.InnerBlocks.Content
			);
		},
	} );
} )();
