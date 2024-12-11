/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import PublicPublishDateTimePicker from '../';

export default {
	title: 'BlockEditor/PublicPublishDateTimePicker',
	component: PublicPublishDateTimePicker,
	argTypes: {
		onChange: { action: 'onChange' },
		onClose: { action: 'onClose' },
	},
};

const Template = ( args ) => {
	const [ currentDate, setCurrentDate ] = useState(
		args.currentDate || null
	);

	return (
		<PublicPublishDateTimePicker
			{ ...args }
			currentDate={ currentDate }
			onChange={ ( date ) => {
				setCurrentDate( date );
				args.onChange( date );
			} }
		/>
	);
};

export const Default = Template.bind( {} );
Default.args = {
	currentDate: new Date().toISOString(),
	showPopoverHeaderActions: true,
};
