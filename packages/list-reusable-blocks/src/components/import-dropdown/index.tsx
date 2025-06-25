/**
 * WordPress dependencies
 */
import { Button, Dropdown } from '@wordpress/components';
import { pipe } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ImportForm from '../import-form';

interface ImportDropdownProps {
	onUpload: ( data: any ) => void;
}

function ImportDropdown( { onUpload }: ImportDropdownProps ) {
	return (
		<Dropdown
			popoverProps={ { placement: 'bottom-start' } }
			contentClassName="list-reusable-blocks-import-dropdown__content"
			renderToggle={ ( { isOpen, onToggle } ) => (
				<Button
					size="compact"
					className="list-reusable-blocks-import-dropdown__button"
					aria-expanded={ isOpen }
					onClick={ onToggle }
					variant="primary"
				>
					{ __( 'Import from JSON' ) }
				</Button>
			) }
			renderContent={ ( { onClose } ) => (
				<ImportForm onUpload={ pipe( onClose, onUpload ) } />
			) }
		/>
	);
}

export default ImportDropdown;
