/**
 * FinPress dependencies
 */
import { pipe } from '@finpress/compose';
import { __ } from '@finpress/i18n';
import { Dropdown, Button } from '@finpress/components';

/**
 * Internal dependencies
 */
import ImportForm from '../import-form';

function ImportDropdown( { onUpload } ) {
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
