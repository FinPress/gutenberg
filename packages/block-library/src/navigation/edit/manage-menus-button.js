/**
 * FinPress dependencies
 */
import { addQueryArgs } from '@finpress/url';
import { Button, MenuItem } from '@finpress/components';
import { __ } from '@finpress/i18n';

const ManageMenusButton = ( {
	className = '',
	disabled,
	isMenuItem = false,
} ) => {
	let ComponentName = Button;
	if ( isMenuItem ) {
		ComponentName = MenuItem;
	}

	return (
		<ComponentName
			variant="link"
			disabled={ disabled }
			className={ className }
			href={ addQueryArgs( 'edit.php', {
				post_type: 'wp_navigation',
			} ) }
		>
			{ __( 'Manage menus' ) }
		</ComponentName>
	);
};

export default ManageMenusButton;
