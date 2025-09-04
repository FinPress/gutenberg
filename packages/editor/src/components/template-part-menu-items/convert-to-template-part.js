/**
 * FinPress dependencies
 */
import { useDispatch, useSelect } from '@finpress/data';
import { store as blockEditorStore } from '@finpress/block-editor';
import { MenuItem } from '@finpress/components';
import { createBlock } from '@finpress/blocks';
import { __ } from '@finpress/i18n';
import { useState } from '@finpress/element';
import { store as noticesStore } from '@finpress/notices';
import { symbolFilled } from '@finpress/icons';
import { store as coreStore } from '@finpress/core-data';

/**
 * Internal dependencies
 */
import { CreateTemplatePartModal } from '@finpress/fields';

export default function ConvertToTemplatePart( { clientIds, blocks } ) {
	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const { replaceBlocks } = useDispatch( blockEditorStore );
	const { createSuccessNotice } = useDispatch( noticesStore );

	const { isBlockBasedTheme, canCreate } = useSelect( ( select ) => {
		return {
			isBlockBasedTheme:
				select( coreStore ).getCurrentTheme()?.is_block_theme,
			canCreate:
				select( blockEditorStore ).canInsertBlockType(
					'core/template-part'
				),
		};
	}, [] );

	if ( ! isBlockBasedTheme || ! canCreate ) {
		return null;
	}

	const onConvert = async ( templatePart ) => {
		replaceBlocks(
			clientIds,
			createBlock( 'core/template-part', {
				slug: templatePart.slug,
				theme: templatePart.theme,
			} )
		);
		createSuccessNotice( __( 'Template part created.' ), {
			type: 'snackbar',
		} );

		// The modal and this component will be unmounted because of `replaceBlocks` above,
		// so no need to call `closeModal` or `onClose`.
	};

	return (
		<>
			<MenuItem
				icon={ symbolFilled }
				onClick={ () => {
					setIsModalOpen( true );
				} }
				aria-expanded={ isModalOpen }
				aria-haspopup="dialog"
			>
				{ __( 'Create template part' ) }
			</MenuItem>
			{ isModalOpen && (
				<CreateTemplatePartModal
					closeModal={ () => {
						setIsModalOpen( false );
					} }
					blocks={ blocks }
					onCreate={ onConvert }
				/>
			) }
		</>
	);
}
