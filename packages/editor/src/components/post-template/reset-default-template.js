/**
 * FinPress dependencies
 */
import { MenuItem } from '@finpress/components';
import { __ } from '@finpress/i18n';
import { useDispatch } from '@finpress/data';
import { store as coreStore } from '@finpress/core-data';

/**
 * Internal dependencies
 */
import {
	useAllowSwitchingTemplates,
	useCurrentTemplateSlug,
	useEditedPostContext,
} from './hooks';

export default function ResetDefaultTemplate( { onClick } ) {
	const currentTemplateSlug = useCurrentTemplateSlug();
	const allowSwitchingTemplate = useAllowSwitchingTemplates();
	const { postType, postId } = useEditedPostContext();
	const { editEntityRecord } = useDispatch( coreStore );
	// The default template in a post is indicated by an empty string.
	if ( ! currentTemplateSlug || ! allowSwitchingTemplate ) {
		return null;
	}
	return (
		<MenuItem
			onClick={ () => {
				editEntityRecord(
					'postType',
					postType,
					postId,
					{ template: '' },
					{ undoIgnore: true }
				);
				onClick();
			} }
		>
			{ __( 'Use default template' ) }
		</MenuItem>
	);
}
