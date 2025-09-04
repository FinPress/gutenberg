/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { useReducer } from '@finpress/element';
import { MenuItem } from '@finpress/components';
import { lockOutline, unlock } from '@finpress/icons';

/**
 * Internal dependencies
 */
import useBlockLock from './use-block-lock';
import BlockLockModal from './modal';

export default function BlockLockMenuItem( { clientId } ) {
	const { canLock, isLocked } = useBlockLock( clientId );

	const [ isModalOpen, toggleModal ] = useReducer(
		( isActive ) => ! isActive,
		false
	);

	if ( ! canLock ) {
		return null;
	}

	const label = isLocked ? __( 'Unlock' ) : __( 'Lock' );

	return (
		<>
			<MenuItem
				icon={ isLocked ? unlock : lockOutline }
				onClick={ toggleModal }
				aria-expanded={ isModalOpen }
				aria-haspopup="dialog"
			>
				{ label }
			</MenuItem>
			{ isModalOpen && (
				<BlockLockModal clientId={ clientId } onClose={ toggleModal } />
			) }
		</>
	);
}
