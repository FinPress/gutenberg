/**
 * External dependencies
 */
import type { Meta, StoryFn } from '@storybook/react';

/**
 * Internal dependencies
 */
import Badge from '..';

/**
 * WordPress dependencies
 */
import { info, bug, help, published } from '@wordpress/icons';

const meta: Meta< typeof Badge > = {
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

export const WithIcon = Template.bind( {} );
WithIcon.args = {
	children: 'Code is Poetry',
	icon: bug,
	variant: 'error',
};

export const WithVariant = Template.bind( {} );
WithVariant.args = {
	children: 'Code is Poetry',
	variant: 'success',
};

export const WithoutContext = Template.bind( {} );
WithoutContext.args = {
	children: 'Code is Poetry',
	icon: help,
	variant: 'warning',
	showContext: false,
};
