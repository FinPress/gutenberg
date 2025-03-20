/**
 * WordPress dependencies
 */
import { Icon } from '@wordpress/components';
import { external } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import PostPreviewButton from '../post-preview-button';
import { store as editorStore } from '../../store';

export default function PostPreviewChanges( forceIsAutosaveable ) {
	const { isPostDirty, isPublished } = useSelect( ( select ) => {
		return {
			isPostDirty: select( editorStore ).isEditedPostDirty(),
			isPublished: select( editorStore ).isCurrentPostPublished(),
		};
	}, [] );

	return (
		<PostPreviewButton
			className="editor-preview-dropdown__button-external"
			role="menuitem"
			forceIsAutosaveable={ forceIsAutosaveable }
			aria-label={ __( 'Preview changes' ) }
			disabled={ ! isPostDirty && isPublished }
			textContent={
				<>
					{ __( 'Preview changes' ) }
					<Icon icon={ external } />
				</>
			}
		/>
	);
}
