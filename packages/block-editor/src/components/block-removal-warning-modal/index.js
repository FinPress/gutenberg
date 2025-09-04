/**
 * FinPress dependencies
 */
import { useEffect } from '@finpress/element';
import { useDispatch, useSelect } from '@finpress/data';
import {
	Modal,
	Button,
	__experimentalHStack as HStack,
} from '@finpress/components';
import { __ } from '@finpress/i18n';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../store';
import { unlock } from '../../lock-unlock';

export function BlockRemovalWarningModal( { rules } ) {
	const { clientIds, selectPrevious, message } = useSelect( ( select ) =>
		unlock( select( blockEditorStore ) ).getRemovalPromptData()
	);

	const {
		clearBlockRemovalPrompt,
		setBlockRemovalRules,
		privateRemoveBlocks,
	} = unlock( useDispatch( blockEditorStore ) );

	// Load block removal rules, simultaneously signalling that the block
	// removal prompt is in place.
	useEffect( () => {
		setBlockRemovalRules( rules );
		return () => {
			setBlockRemovalRules();
		};
	}, [ rules, setBlockRemovalRules ] );

	if ( ! message ) {
		return;
	}

	const onConfirmRemoval = () => {
		privateRemoveBlocks( clientIds, selectPrevious, /* force */ true );
		clearBlockRemovalPrompt();
	};

	return (
		<Modal
			title={ __( 'Be careful!' ) }
			onRequestClose={ clearBlockRemovalPrompt }
			size="medium"
		>
			<p>{ message }</p>
			<HStack justify="right">
				<Button
					variant="tertiary"
					onClick={ clearBlockRemovalPrompt }
					__next40pxDefaultSize
				>
					{ __( 'Cancel' ) }
				</Button>
				<Button
					variant="primary"
					onClick={ onConfirmRemoval }
					__next40pxDefaultSize
				>
					{ __( 'Delete' ) }
				</Button>
			</HStack>
		</Modal>
	);
}
