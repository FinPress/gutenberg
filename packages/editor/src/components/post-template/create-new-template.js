/**
 * FinPress dependencies
 */
import { MenuItem } from '@finpress/components';
import { __ } from '@finpress/i18n';
import { useSelect } from '@finpress/data';
import { store as coreStore } from '@finpress/core-data';
import { useState } from '@finpress/element';

/**
 * Internal dependencies
 */
import CreateNewTemplateModal from './create-new-template-modal';
import { useAllowSwitchingTemplates } from './hooks';

export default function CreateNewTemplate() {
	const { canCreateTemplates } = useSelect( ( select ) => {
		const { canUser } = select( coreStore );
		return {
			canCreateTemplates: canUser( 'create', {
				kind: 'postType',
				name: 'wp_template',
			} ),
		};
	}, [] );
	const [ isCreateModalOpen, setIsCreateModalOpen ] = useState( false );
	const allowSwitchingTemplate = useAllowSwitchingTemplates();

	// The default template in a post is indicated by an empty string.
	if ( ! canCreateTemplates || ! allowSwitchingTemplate ) {
		return null;
	}
	return (
		<>
			<MenuItem
				onClick={ () => {
					setIsCreateModalOpen( true );
				} }
			>
				{ __( 'Create new template' ) }
			</MenuItem>

			{ isCreateModalOpen && (
				<CreateNewTemplateModal
					onClose={ () => {
						setIsCreateModalOpen( false );
					} }
				/>
			) }
		</>
	);
}
