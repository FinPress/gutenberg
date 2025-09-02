/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import TextShadowControl from '../index';

const meta = {
	title: 'BlockEditor/TextShadowControl',
	component: TextShadowControl,
	parameters: {
		docs: {
			canvas: { sourceState: 'shown' },
			description: {
				component:
					'Control for managing text shadow styles including offset, blur, and color.',
			},
		},
	},
	argTypes: {
		value: {
			control: { type: 'text' },
			description: 'Current text shadow CSS value',
		},
		onChange: {
			action: 'onChange',
			description: 'Function called when text shadow changes',
		},
		__next40pxDefaultSize: {
			control: { type: 'boolean' },
			description: 'Whether to use 40px default height',
		},
		__nextHasNoMarginBottom: {
			control: { type: 'boolean' },
			description: 'Whether to remove bottom margin',
		},
	},
};

export default meta;

export const Default = {
	render: function Template( { onChange, ...args } ) {
		const [ value, setValue ] = useState( args.value );
		return (
			<TextShadowControl
				{ ...args }
				value={ value }
				onChange={ ( newValue ) => {
					setValue( newValue );
					onChange( newValue );
				} }
			/>
		);
	},
	args: {
		value: 'none',
		__next40pxDefaultSize: true,
		__nextHasNoMarginBottom: true,
	},
};

export const WithShadow = {
	render: function Template( { onChange, ...args } ) {
		const [ value, setValue ] = useState( args.value );
		return (
			<TextShadowControl
				{ ...args }
				value={ value }
				onChange={ ( newValue ) => {
					setValue( newValue );
					onChange( newValue );
				} }
			/>
		);
	},
	args: {
		value: '2px 2px 4px #000000',
		__next40pxDefaultSize: true,
		__nextHasNoMarginBottom: true,
	},
};

export const GlowEffect = {
	render: function Template( { onChange, ...args } ) {
		const [ value, setValue ] = useState( args.value );
		return (
			<TextShadowControl
				{ ...args }
				value={ value }
				onChange={ ( newValue ) => {
					setValue( newValue );
					onChange( newValue );
				} }
			/>
		);
	},
	args: {
		value: '0px 0px 10px #00ff00',
		__next40pxDefaultSize: true,
		__nextHasNoMarginBottom: true,
	},
};

export const ColoredShadow = {
	render: function Template( { onChange, ...args } ) {
		const [ value, setValue ] = useState( args.value );
		return (
			<TextShadowControl
				{ ...args }
				value={ value }
				onChange={ ( newValue ) => {
					setValue( newValue );
					onChange( newValue );
				} }
			/>
		);
	},
	args: {
		value: '3px 3px 6px rgba(255, 0, 0, 0.5)',
		__next40pxDefaultSize: true,
		__nextHasNoMarginBottom: true,
	},
};

export const NegativeOffset = {
	render: function Template( { onChange, ...args } ) {
		const [ value, setValue ] = useState( args.value );
		return (
			<TextShadowControl
				{ ...args }
				value={ value }
				onChange={ ( newValue ) => {
					setValue( newValue );
					onChange( newValue );
				} }
			/>
		);
	},
	args: {
		value: '-2px -2px 4px #333333',
		__next40pxDefaultSize: true,
		__nextHasNoMarginBottom: true,
	},
};

export const LargeShadow = {
	render: function Template( { onChange, ...args } ) {
		const [ value, setValue ] = useState( args.value );
		return (
			<TextShadowControl
				{ ...args }
				value={ value }
				onChange={ ( newValue ) => {
					setValue( newValue );
					onChange( newValue );
				} }
			/>
		);
	},
	args: {
		value: '5px 5px 15px rgba(0, 0, 0, 0.8)',
		__next40pxDefaultSize: true,
		__nextHasNoMarginBottom: true,
	},
};
