( function () {
	const el = fp.element.createElement;
	const Fragment = fp.element.Fragment;
	const Button = fp.components.Button;
	const PanelBody = fp.components.PanelBody;
	const InspectorControls = fp.blockEditor.InspectorControls;
	const addFilter = fp.hooks.addFilter;
	const createBlock = fp.blocks.createBlock;
	const __ = fp.i18n.__;

	function ResetBlockButton( props ) {
		return el(
			PanelBody,
			{},
			el(
				Button,
				{
					className: 'e2e-reset-block-button',
					variant: 'secondary',
					onClick() {
						const emptyBlock = createBlock( props.name );
						props.onReplace( emptyBlock );
					},
				},
				__( 'Reset Block' )
			)
		);
	}

	function addResetBlockButton( BlockEdit ) {
		return function ( props ) {
			return el(
				Fragment,
				{},
				el(
					InspectorControls,
					{},
					el( ResetBlockButton, {
						name: props.name,
						onReplace: props.onReplace,
					} )
				),
				el( BlockEdit, props )
			);
		};
	}

	addFilter(
		'editor.BlockEdit',
		'e2e/hooks-api/add-reset-block-button',
		addResetBlockButton,
		100
	);
} )();
