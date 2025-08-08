/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useRef, useEffect } from '@wordpress/element';
import { seen, unseen } from '@wordpress/icons';
import { useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import useBlockVisibility from './use-block-visibility';
import { store as blockEditorStore } from '../../store';

export default function BlockVisibilityToolbar( { clientId } ) {
	const { canToggleBlockVisibility, isBlockVisible } =
		useBlockVisibility( clientId );

	const hasBlockVisibilityButtonShownRef = useRef( false );
	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	// If the block visibility button has been shown, we don't want to
	// remove it from the toolbar until the toolbar is rendered again
	// without it. Removing it beforehand can cause focus loss issues.
	// It needs to return focus from whence it came, and to do that,
	// we need to leave the button in the toolbar.
	useEffect( () => {
		if ( ! isBlockVisible ) {
			hasBlockVisibilityButtonShownRef.current = true;
		}
	}, [ isBlockVisible ] );

	if ( isBlockVisible && ! hasBlockVisibilityButtonShownRef.current ) {
		return null;
	}

	const label = isBlockVisible ? __( 'Hide' ) : __( 'Show' );

	return (
		<>
			<ToolbarGroup className="block-editor-block-lock-toolbar">
				<ToolbarButton
					disabled={ ! canToggleBlockVisibility }
					icon={ isBlockVisible ? seen : unseen }
					label={ label }
					onClick={ () => {
						const newBlockVisibility = ! isBlockVisible;
						updateBlockAttributes( [ clientId ], {
							metadata: {
								blockVisibility: newBlockVisibility
									? undefined
									: false,
							},
						} );
					} }
				/>
			</ToolbarGroup>
		</>
	);
}
