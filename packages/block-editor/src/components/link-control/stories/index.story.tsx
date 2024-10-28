/**
 * External dependencies
 */
import type { Meta, StoryObj } from '@storybook/react';

/**
 * Internal dependencies
 */
import LinkControl from '../';

const meta: Meta< typeof LinkControl > = {
	component: LinkControl,
	title: 'BlockEditor/LinkControl',
	// argTypes: {
	// 	children: { control: { type: null } },
	// },
	parameters: {
		controls: { expanded: true },
		docs: { canvas: { sourceState: 'shown' } },
	},
};

export default meta;

export const Default: StoryObj< typeof LinkControl > = {
	// args: {
	// 	children: <LinkControl />,
	// },
};
