/**
 * FinPress dependencies
 */
import { __experimentalConfirmDialog as ConfirmDialog } from '@finpress/components';
import { __ } from '@finpress/i18n';

function ConfirmResetShadowDialog( {
	text,
	confirmButtonText,
	isOpen,
	toggleOpen,
	onConfirm,
} ) {
	const handleConfirm = async () => {
		toggleOpen();
		onConfirm();
	};

	const handleCancel = () => {
		toggleOpen();
	};

	return (
		<ConfirmDialog
			isOpen={ isOpen }
			cancelButtonText={ __( 'Cancel' ) }
			confirmButtonText={ confirmButtonText }
			onCancel={ handleCancel }
			onConfirm={ handleConfirm }
			size="medium"
		>
			{ text }
		</ConfirmDialog>
	);
}

export default ConfirmResetShadowDialog;
