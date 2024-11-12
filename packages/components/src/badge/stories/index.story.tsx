/**
 * External dependencies
 */
import type { Meta, StoryObj } from '@storybook/react';

/**
 * Internal dependencies
 */
import Badge from '..';

const meta = {
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
		context: {
			control: { type: 'select' },
			options: [ 'neutral', 'info', 'warning', 'error', 'success' ],
		},
		children: {
			control: { type: null },
		},
	},
	tags: [ 'status-private' ],
} satisfies Meta< typeof Badge >;

export default meta;

type Story = StoryObj< typeof meta >;

export const Default: Story = {
	args: {
		children: 'Code is Poetry',
		context: 'neutral',
	},
};

export const WithContext: Story = {
	args: {
		children: 'Code is Poetry',
		context: 'success',
	},
};
