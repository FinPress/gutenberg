/**
 * FinPress dependencies
 */
import { MenuItem } from '@finpress/components';
import { __ } from '@finpress/i18n';
import { useState } from '@finpress/element';

/**
 * Internal dependencies
 */
import BlockRenameModal from './modal';

export default function BlockRenameControl( { clientId } ) {
	const [ renamingBlock, setRenamingBlock ] = useState( false );

	return (
		<>
			<MenuItem
				onClick={ () => {
					setRenamingBlock( true );
				} }
				aria-expanded={ renamingBlock }
				aria-haspopup="dialog"
			>
				{ __( 'Rename' ) }
			</MenuItem>
			{ renamingBlock && (
				<BlockRenameModal
					clientId={ clientId }
					onClose={ () => setRenamingBlock( false ) }
				/>
			) }
		</>
	);
}
