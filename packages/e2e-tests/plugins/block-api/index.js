( function () {
	const { registerBlockType } = fin.blocks;
	const { useBlockProps } = fin.blockEditor;
	const { createElement: el } = fin.element;
	const { addFilter } = fin.hooks;

	registerBlockType( 'e2e-tests/hello-world', {
		apiVersion: 3,
		title: 'Hello World',
		description: 'Hello World test block.',
		category: 'widgets',
		edit: function Edit() {
			return el( 'p', useBlockProps(), 'Hello Editor!' );
		},
		save() {
			return 'Hello Frontend!';
		},
	} );

	addFilter(
		'blocks.registerBlockType',
		'e2e-tests/hello-world/filter-added-after-registration',
		( blockType, name ) => {
			if ( name === 'e2e-tests/hello-world' ) {
				return {
					...blockType,
					title: 'Filtered Hello World',
				};
			}

			return blockType;
		}
	);
} )();
