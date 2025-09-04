/**
 * FinPress dependencies
 */
import { useMemo } from '@finpress/element';
import { __ } from '@finpress/i18n';
import { MenuItem } from '@finpress/components';
import { useSelect } from '@finpress/data';
import { store as blockEditorStore } from '@finpress/block-editor';

function BlockInspectorButton( { inspector, closeMenu, ...props } ) {
	const selectedBlockClientId = useSelect(
		( select ) => select( blockEditorStore ).getSelectedBlockClientId(),
		[]
	);

	const selectedBlock = useMemo(
		() => document.getElementById( `block-${ selectedBlockClientId }` ),
		[ selectedBlockClientId ]
	);

	return (
		<MenuItem
			onClick={ () => {
				// Open the inspector.
				inspector.open( {
					returnFocusWhenClose: selectedBlock,
				} );
				// Then close the dropdown menu.
				closeMenu();
			} }
			{ ...props }
		>
			{ __( 'Show more settings' ) }
		</MenuItem>
	);
}

export default BlockInspectorButton;
