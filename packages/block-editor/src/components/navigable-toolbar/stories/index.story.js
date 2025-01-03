/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import NavigableToolbar from '../';

const meta = {
	title: 'BlockEditor/NavigableToolbar',
	component: NavigableToolbar,
	parameters: {
		docs: {
			canvas: { sourceState: 'shown' },
			description: {
				component: 'A toolbar that can be navigated with a keyboard.',
			},
		},
	},
	argTypes: {
		focusOnMount: {
			control: { type: 'boolean' },
			description:
				'Whether to immediately focus when the component mounts (Deprecated).',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: false },
			},
			deprecated: true,
		},
		focusEditorOnEscape: {
			control: { type: 'boolean' },
			description:
				'Whether to focus back to editor when pressing escape.',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: false },
			},
		},
		shouldUseKeyboardFocusShortcut: {
			control: { type: 'boolean' },
			description:
				'Whether the toolbar should respond to keyboard focus shortcut (Alt+F10).',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: true },
			},
		},
		orientation: {
			control: { type: 'select' },
			options: [ 'horizontal', 'vertical' ],
			description: 'The orientation of the toolbar.',
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: 'horizontal' },
			},
		},
		'aria-label': {
			control: { type: 'text' },
			description: 'Accessibility label for the toolbar.',
			table: {
				type: { summary: 'string' },
			},
		},
	},
	args: {
		focusOnMount: false,
		focusEditorOnEscape: false,
		shouldUseKeyboardFocusShortcut: true,
		orientation: 'horizontal',
		'aria-label': 'Toolbar',
	},
};

export default meta;

export const Default = {
	render: function Template( args ) {
		return (
			<NavigableToolbar { ...args }>
				<Button variant="primary">Button 1</Button>
				<Button>Button 2</Button>
				<Button>Button 3</Button>
			</NavigableToolbar>
		);
	},
};

export const VerticalOrientation = {
	render: function Template( args ) {
		return (
			<NavigableToolbar { ...args } orientation="vertical">
				<Button variant="primary">Button 1</Button>
				<Button>Button 2</Button>
				<Button>Button 3</Button>
			</NavigableToolbar>
		);
	},
};
