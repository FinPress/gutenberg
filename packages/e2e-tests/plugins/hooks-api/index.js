( function () {
	const el = fin.element.createElement;
	const Fragment = fin.element.Fragment;
	const Button = fin.components.Button;
	const PanelBody = fin.components.PanelBody;
	const InspectorControls = fin.blockEditor.InspectorControls;
	const addFilter = fin.hooks.addFilter;
	const createBlock = fin.blocks.createBlock;
	const __ = fin.i18n.__;

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
