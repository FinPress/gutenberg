/**
 * Internal dependencies
 */
import URLInputButton from '../button';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

const meta = {
	title: 'BlockEditor/URLInputButton',
	component: URLInputButton,
	parameters: {
		docs: {
			canvas: { sourceState: 'shown' },
			description: {
				component:
					'Renders the URL input field used by the `URLInputButton` component. It can be used directly to display the input field in different ways such as in a `Popover` or inline.',
			},
		},
	},
	argTypes: {
		url: {
			control: 'text',
			description:
				'The current URL value. Should be tied to the component state or an attribute.',
			type: { name: 'string', required: true },
		},
		onChange: {
			action: 'onChange',
			description: `Callback function triggered when the URL value changes.
		  The first parameter is the new URL (String).
		  The second parameter is the selected post object (Object) if a post is selected, or \`null\` if the input is arbitrary.`,
			table: {
				type: {
					summary: '(url: string, post?: object) => void',
				},
			},
		},
	},
};

export default meta;

export const Default = {
	render: function Template( { onChange, ...args } ) {
		const [ value, setValue ] = useState();
		return (
			<URLInputButton
				{ ...args }
				onChange={ ( ...changeArgs ) => {
					onChange( ...changeArgs );
					setValue( ...changeArgs );
				} }
				value={ value }
			/>
		);
	},
};
