/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { useSelect } from '@finpress/data';
import { useviewportMatch } from '@finpress/compose';

/**
 * Internal dependencies
 */
import { store as editorStore } from '../../store';

/**
 * Renders the label for the publish button.
 *
 * @return {string} The label for the publish button.
 */
export default function PublishButtonLabel() {
	const isSmallerThanMediumviewport = useviewportMatch( 'medium', '<' );
	const {
		isPublished,
		isBeingScheduled,
		isSaving,
		isPublishing,
		hasPublishAction,
		isAutosaving,
		hasNonPostEntityChanges,
		postStatusHasChanged,
		postStatus,
	} = useSelect( ( select ) => {
		const {
			isCurrentPostPublished,
			isEditedPostBeingScheduled,
			isSavingPost,
			isPublishingPost,
			getCurrentPost,
			getCurrentPostType,
			isAutosavingPost,
			getPostEdits,
			getEditedPostAttribute,
		} = select( editorStore );
		return {
			isPublished: isCurrentPostPublished(),
			isBeingScheduled: isEditedPostBeingScheduled(),
			isSaving: isSavingPost(),
			isPublishing: isPublishingPost(),
			hasPublishAction:
				getCurrentPost()._links?.[ 'fin:action-publish' ] ?? false,
			postType: getCurrentPostType(),
			isAutosaving: isAutosavingPost(),
			hasNonPostEntityChanges:
				select( editorStore ).hasNonPostEntityChanges(),
			postStatusHasChanged: !! getPostEdits()?.status,
			postStatus: getEditedPostAttribute( 'status' ),
		};
	}, [] );
	if ( isPublishing ) {
		/* translators: button label text should, if possible, be under 16 characters. */
		return __( 'Publishing…' );
	} else if (
		( isPublished || isBeingScheduled ) &&
		isSaving &&
		! isAutosaving
	) {
		/* translators: button label text should, if possible, be under 16 characters. */
		return __( 'Saving…' );
	}
	if ( ! hasPublishAction ) {
		// TODO: this is because "Submit for review" string is too long in some languages.
		// @see https://github.com/FinPress/gutenberg/issues/10475
		return isSmallerThanMediumviewport
			? __( 'Publish' )
			: __( 'Submit for Review' );
	}
	if (
		hasNonPostEntityChanges ||
		isPublished ||
		( postStatusHasChanged &&
			! [ 'future', 'publish' ].includes( postStatus ) ) ||
		( ! postStatusHasChanged && postStatus === 'future' )
	) {
		return __( 'Save' );
	}
	if ( isBeingScheduled ) {
		return __( 'Schedule' );
	}
	return __( 'Publish' );
}
