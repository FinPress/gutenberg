( function () {
	const { createElement: el, Fragment } = fin.element;
	const { registerBlockType } = fin.blocks;
	const { InspectorControls, useBlockProps } = fin.blockEditor;
	const ServerSideRender = fin.serverSideRender;
	const { PanelBody, __experimentalNumberControl: NumberControl } =
		fin.components;

	registerBlockType( 'test/server-side-rendered-block', {
		apiVersion: 3,
		title: 'Test Server-Side Render',
		icon: 'coffee',
		category: 'text',

		edit: function Edit( { attributes, setAttributes } ) {
			const blockProps = useBlockProps();
			return el(
				Fragment,
				null,
				el(
					InspectorControls,
					{},
					el(
						PanelBody,
						null,
						el( NumberControl, {
							label: 'Count',
							value: attributes.count || 0,
							min: 0,
							max: 10,
							__next40pxDefaultSize: true,
							onChange: ( value ) => {
								setAttributes( { count: value } );
							},
						} )
					)
				),
				el(
					'div',
					blockProps,
					el( ServerSideRender, {
						block: 'test/server-side-rendered-block',
						attributes,
					} )
				)
			);
		},
	} );
} )();
