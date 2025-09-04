/**
 * FinPress dependencies
 */
import { MenuItem } from '@finpress/components';
import { useSelect, useDispatch } from '@finpress/data';
import { __ } from '@finpress/i18n';
import { useCopyToClipboard } from '@finpress/compose';
import { store as noticesStore } from '@finpress/notices';
import { store as coreStore } from '@finpress/core-data';
import { __unstableSerializeAndClean } from '@finpress/blocks';

/**
 * Internal dependencies
 */
import { store as editorStore } from '../../store';

export default function CopyContentMenuItem() {
	const { createNotice } = useDispatch( noticesStore );
	const { getCurrentPostId, getCurrentPostType } = useSelect( editorStore );
	const { getEditedEntityRecord } = useSelect( coreStore );

	function getText() {
		const record = getEditedEntityRecord(
			'postType',
			getCurrentPostType(),
			getCurrentPostId()
		);
		if ( ! record ) {
			return '';
		}

		if ( typeof record.content === 'function' ) {
			return record.content( record );
		} else if ( record.blocks ) {
			return __unstableSerializeAndClean( record.blocks );
		} else if ( record.content ) {
			return record.content;
		}
	}

	function onSuccess() {
		createNotice( 'info', __( 'All content copied.' ), {
			isDismissible: true,
			type: 'snackbar',
		} );
	}

	const ref = useCopyToClipboard( getText, onSuccess );

	return <MenuItem ref={ ref }>{ __( 'Copy all blocks' ) }</MenuItem>;
}
