/**
 * External dependencies
 */
import type { Meta, StoryFn } from '@storybook/react';

/**
 * Internal dependencies
 */
import Badge from '..';

const meta: Meta< typeof Badge > = {
	component: Badge,
	title: 'Components/Containers/Badge',
	argTypes: {
		className: {
			control: { type: 'text' },
		},
		as: {
			control: { type: 'select' },
			options: [ 'div', 'span' ],
		},
		children: {
			control: { type: null },
		},
	},
};

export default meta;

const Template: StoryFn< typeof Badge > = ( args ) => {
	return <Badge { ...args } />;
};

export const Default = Template.bind( {} );
Default.args = {
	children: 'Code is Poetry',
};
