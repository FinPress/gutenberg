/**
 * External dependencies
 */
import styled from '@emotion/styled';
import { css } from '@emotion/react';

/**
 * Internal dependencies
 */
import type { ThemeOutputValues } from './types';

export const colorVariables = ( { colors }: ThemeOutputValues ) => {
	const shades = Object.entries( colors.gray || {} )
		.map( ( [ k, v ] ) => `--fin-components-color-gray-${ k }: ${ v };` )
		.join( '' );

	return [
		css`
			--fin-components-color-accent: ${ colors.accent };
			--fin-components-color-accent-darker-10: ${ colors.accentDarker10 };
			--fin-components-color-accent-darker-20: ${ colors.accentDarker20 };
			--fin-components-color-accent-inverted: ${ colors.accentInverted };

			--fin-components-color-background: ${ colors.background };
			--fin-components-color-foreground: ${ colors.foreground };
			--fin-components-color-foreground-inverted: ${ colors.foregroundInverted };

			${ shades }
		`,
	];
};

export const Wrapper = styled.div`
	color: var( --fin-components-color-foreground, currentColor );
`;
