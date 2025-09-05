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
		.map( ( [ k, v ] ) => `--fp-components-color-gray-${ k }: ${ v };` )
		.join( '' );

	return [
		css`
			--fp-components-color-accent: ${ colors.accent };
			--fp-components-color-accent-darker-10: ${ colors.accentDarker10 };
			--fp-components-color-accent-darker-20: ${ colors.accentDarker20 };
			--fp-components-color-accent-inverted: ${ colors.accentInverted };

			--fp-components-color-background: ${ colors.background };
			--fp-components-color-foreground: ${ colors.foreground };
			--fp-components-color-foreground-inverted: ${ colors.foregroundInverted };

			${ shades }
		`,
	];
};

export const Wrapper = styled.div`
	color: var( --fp-components-color-foreground, currentColor );
`;
