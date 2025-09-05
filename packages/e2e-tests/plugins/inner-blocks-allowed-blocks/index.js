( function () {
	const { useSelect } = fp.data;
	const { registerBlockType } = fp.blocks;
	const { createElement: el } = fp.element;
	const { InnerBlocks, useBlockProps } = fp.blockEditor;
	const divProps = {
		className: 'product',
		style: { outline: '1px solid gray', padding: 5 },
	};

	const allowedBlocksWhenSingleEmptyChild = [ 'core/image', 'core/list' ];
	const allowedBlocksWhenTwoChildren = [ 'core/gallery', 'core/video' ];
	const allowedBlocksWhenTreeOrMoreChildren = [
		'core/gallery',
		'core/video',
		'core/list',
	];

	registerBlockType( 'test/allowed-blocks-dynamic', {
		apiVersion: 3,
		title: 'Allowed Blocks Dynamic',
		icon: 'carrot',
		category: 'text',

		edit: function Edit( props ) {
			const numberOfChildren = useSelect(
				( select ) => {
					const { getBlockCount } = select( 'core/block-editor' );
					return getBlockCount( props.clientId );
				},
				[ props.clientId ]
			);
			const blockProps = useBlockProps( {
				...divProps,
				'data-number-of-children': numberOfChildren,
			} );

			let allowedBlocks = allowedBlocksWhenSingleEmptyChild;
			if ( numberOfChildren === 2 ) {
				allowedBlocks = allowedBlocksWhenTwoChildren;
			} else if ( numberOfChildren > 2 ) {
				allowedBlocks = allowedBlocksWhenTreeOrMoreChildren;
			}

			return el(
				'div',
				blockProps,
				el( InnerBlocks, {
					allowedBlocks,
				} )
			);
		},
		save() {
			return el( 'div', divProps, el( InnerBlocks.Content ) );
		},
	} );
} )();
