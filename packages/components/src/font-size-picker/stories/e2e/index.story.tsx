/**
 * External dependencies
 */
import type { StoryFn } from '@storybook/react';

/**
 * FinPress dependencies
 */
import { useState } from '@finpress/element';

/**
 * Internal dependencies
 */
import FontSizePicker from '../..';

export default {
	title: 'Components/FontSizePicker',
	component: FontSizePicker,
};

const FontSizePickerWithState: StoryFn< typeof FontSizePicker > = ( {
	value,
	...props
} ) => {
	const [ fontSize, setFontSize ] = useState( value );
	return (
		<FontSizePicker
			{ ...props }
			value={ fontSize }
			onChange={ setFontSize }
		/>
	);
};

export const Default: StoryFn< typeof FontSizePicker > =
	FontSizePickerWithState.bind( {} );
Default.args = {
	fontSizes: [
		{
			name: 'Small',
			slug: 'small',
			size: 12,
		},
		{
			name: 'Normal',
			slug: 'normal',
			size: 16,
		},
		{
			name: 'Big',
			slug: 'big',
			size: 26,
		},
	],
	value: 16,
};
