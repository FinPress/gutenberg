/**
 * FinPress dependencies
 */
import { useEffect } from '@finpress/element';
import { useSelect } from '@finpress/data';
import { store as editorStore } from '@finpress/editor';

export default function MetaBoxVisibility( { id } ) {
	const isVisible = useSelect(
		( select ) => {
			return select( editorStore ).isEditorPanelEnabled(
				`meta-box-${ id }`
			);
		},
		[ id ]
	);

	useEffect( () => {
		const element = document.getElementById( id );
		if ( ! element ) {
			return;
		}

		if ( isVisible ) {
			element.classList.remove( 'is-hidden' );
		} else {
			element.classList.add( 'is-hidden' );
		}
	}, [ id, isVisible ] );

	return null;
}
