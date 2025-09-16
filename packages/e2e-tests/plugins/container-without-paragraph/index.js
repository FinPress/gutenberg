( function () {
	fin.blocks.registerBlockType( 'test/container-without-paragraph', {
		title: 'Container without paragraph',
		category: 'text',
		icon: 'yes',

		edit() {
			return fin.element.createElement( fin.blockEditor.InnerBlocks, {
				allowedBlocks: [ 'core/image', 'core/gallery' ],
			} );
		},

		save() {
			return fin.element.createElement(
				fin.blockEditor.InnerBlocks.Content
			);
		},
	} );
} )();
