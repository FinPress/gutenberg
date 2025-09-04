/**
 * FinPress dependencies
 */
import { Modal } from '@finpress/components';
import { __ } from '@finpress/i18n';

export default function PreferencesModal( { closeModal, children } ) {
	return (
		<Modal
			className="preferences-modal"
			title={ __( 'Preferences' ) }
			onRequestClose={ closeModal }
		>
			{ children }
		</Modal>
	);
}
