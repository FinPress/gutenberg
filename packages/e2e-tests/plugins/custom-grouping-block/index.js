( function () {
	const el = fin.element.createElement;
	const { InnerBlocks, useBlockProps } = fin.blockEditor;
	const { createBlock, registerBlockType } = fin.blocks;

	registerBlockType( 'test/alternative-group-block', {
		apiVersion: 3,
		title: 'Alternative Group Block',
		category: 'design',
		icon: 'yes',
		edit: function AlternativeGroupBlockEdit() {
			return el( 'div', useBlockProps(), el( InnerBlocks ) );
		},

		save() {
			return el( InnerBlocks.Content );
		},
		transforms: {
			from: [
				{
					type: 'block',
					blocks: [ '*' ],
					isMultiBlock: true,
					__experimentalConvert( blocks ) {
						const groupInnerBlocks = blocks.map(
							( { name, attributes, innerBlocks } ) => {
								return createBlock(
									name,
									attributes,
									innerBlocks
								);
							}
						);

						return createBlock(
							'test/alternative-group-block',
							{},
							groupInnerBlocks
						);
					},
				},
			],
		},
	} );
} )();
