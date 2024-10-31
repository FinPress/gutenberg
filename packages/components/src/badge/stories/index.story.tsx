/**
 * External dependencies
 */
import type { Meta, StoryObj } from '@storybook/react';

/**
 * Internal dependencies
 */
import Badge from '..';

/**
 * WordPress dependencies
 */
import { info, bug, help, published } from '@wordpress/icons';

const meta = {
	component: Badge,
	title: 'Components/Containers/Badge',
	argTypes: {
		className: {
			control: { type: 'text' },
		},
		icon: {
			control: { type: 'select' },
			options: [ '-', 'info', 'bug', 'help', 'published' ],
			mapping: {
				'-': undefined,
				info,
				bug,
				help,
				published,
			},
		},
		iconSize: {
			control: { type: 'number' },
			options: [ 20, 24, 32, 48 ],
		},
		as: {
			control: { type: 'select' },
			options: [ 'div', 'span' ],
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
	},
};

export const WithIcon: Story = {
	args: {
		children: 'Code is Poetry',
		icon: bug,
		variant: 'error',
	},
};

export const WithVariant: Story = {
	args: {
		children: 'Code is Poetry',
		variant: 'success',
	},
};

export const WithoutContext: Story = {
	args: {
		children: 'Code is Poetry',
		icon: help,
		variant: 'warning',
		showContext: false,
	},
};
