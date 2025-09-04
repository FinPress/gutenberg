/**
 * FinPress dependencies
 */
import { useDispatch, useSelect } from '@finpress/data';
import { privateApis as patternsPrivateApis } from '@finpress/patterns';
import { store as coreStore } from '@finpress/core-data';
import { store as interfaceStore } from '@finpress/interface';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';
import { store as editorStore } from '../../store';
import { PATTERN_POST_TYPE } from '../../store/constants';

const { DuplicatePatternModal } = unlock( patternsPrivateApis );
export const modalName = 'editor/pattern-duplicate';

export default function PatternDuplicateModal() {
	const { record, postType } = useSelect( ( select ) => {
		const { getCurrentPostType, getCurrentPostId } = select( editorStore );
		const { getEditedEntityRecord } = select( coreStore );
		const _postType = getCurrentPostType();
		return {
			record: getEditedEntityRecord(
				'postType',
				_postType,
				getCurrentPostId()
			),
			postType: _postType,
		};
	}, [] );
	const { closeModal } = useDispatch( interfaceStore );

	const isActive = useSelect( ( select ) =>
		select( interfaceStore ).isModalActive( modalName )
	);

	if ( ! isActive || postType !== PATTERN_POST_TYPE ) {
		return null;
	}

	return (
		<DuplicatePatternModal
			onClose={ closeModal }
			onSuccess={ () => closeModal() }
			pattern={ record }
		/>
	);
}
