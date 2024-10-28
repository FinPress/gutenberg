/**
 * External dependencies
 */
import type { Meta, StoryFn } from '@storybook/react';

/**
 * Internal dependencies
 */
import LinkControl from '..';

const meta: Meta< typeof LinkControl > = {
	component: LinkControl,
	title: 'BlockEditor/LinkControl',
	argTypes: {
		onChange: {
			action: 'onChange',
		},
	},
	parameters: {
		controls: { expanded: true },
		docs: { canvas: { sourceState: 'shown' } },
	},
};

export default meta;

const Template: StoryFn< typeof LinkControl > = ( { ...args } ) => (
	<LinkControl { ...args } />
);

export const Default: StoryFn< typeof LinkControl > = Template.bind( {} );
Default.args = {};

// export const DefaultTemplate: StoryFn< typeof LinkControl > = ( {
// 	onChange,
// 	...args
// } ) => {
// 	return (
// 		<LinkControl
// 			{ ...args }
// 			onChange={ ( v ) => {
// 				onChange( v );
// 			} }
// 		/>
// 	);
// };

/**
 * Controls the query parameters used to search for suggestions.
 * For example, to limit a query to just `Page` types use:
 */
export const SuggestionsQuery: StoryFn< typeof LinkControl > = ( {
	...args
} ) => {
	return (
		<LinkControl
			{ ...args }
			suggestionsQuery={ {
				type: 'post',
				subtype: 'page',
			} }
		/>
	);
};
