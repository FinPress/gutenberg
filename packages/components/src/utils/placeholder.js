/**
 * External dependencies
 */
import { css } from '@emotion/react';

/**
 * Internal dependencies
 */
import { COLORS } from './colors-values';

export const placeholderStyles = css`
	&::placeholder {
		color: ${ COLORS.ui.darkGrayPlaceholder };
	}

	&::-webkit-input-placeholder {
		color: ${ COLORS.ui.darkGrayPlaceholder };
	}

	&::-moz-placeholder {
		color: ${ COLORS.ui.darkGrayPlaceholder };
	}

	&:-ms-input-placeholder {
		color: ${ COLORS.ui.darkGrayPlaceholder };
	}
`;
