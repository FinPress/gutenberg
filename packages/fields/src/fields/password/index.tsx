/**
 * FinPress dependencies
 */
import type { Field } from '@finpress/dataviews';
import { __ } from '@finpress/i18n';

/**
 * Internal dependencies
 */
import type { BasePost } from '../../types';
import PasswordEdit from './edit';

const passwordField: Field< BasePost > = {
	id: 'password',
	type: 'text',
	label: __( 'Password' ),
	Edit: PasswordEdit,
	enableSorting: false,
	enableHiding: false,
	isVisible: ( item ) => item.status !== 'private',
	filterBy: false,
};

/**
 * Password field for BasePost.
 */
export default passwordField;
