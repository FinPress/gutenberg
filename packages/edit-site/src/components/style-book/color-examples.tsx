/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { __experimentalGrid as Grid } from '@finpress/components';
import { View } from '@finpress/primitives';
import {
	getColorClassName,
	__experimentalGetGradientClass,
	// @finpress/block-editor imports are not typed.
	// @ts-expect-error
} from '@finpress/block-editor';

/**
 * Internal dependencies
 */
import type { Color, Gradient, ColorExampleProps } from './types';

const ColorExamples = ( {
	colors,
	type,
	templateColumns = '1fr 1fr',
	itemHeight = '52px',
}: ColorExampleProps ): JSX.Element | null => {
	if ( ! colors ) {
		return null;
	}

	return (
		<Grid templateColumns={ templateColumns } rowGap={ 8 } columnGap={ 16 }>
			{ colors.map( ( color: Color | Gradient ) => {
				const className =
					type === 'gradients'
						? __experimentalGetGradientClass( color.slug )
						: getColorClassName( 'background-color', color.slug );
				const classes = clsx(
					'edit-site-style-book__color-example',
					className
				);

				return (
					<View
						key={ color.slug }
						className={ classes }
						style={ { height: itemHeight } }
					/>
				);
			} ) }
		</Grid>
	);
};

export default ColorExamples;
