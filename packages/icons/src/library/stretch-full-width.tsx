/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

/**
 * External dependencies
 */
import type { ReactElement } from 'react';

const stretchFullWidth: ReactElement = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M5 4h14v11H5V4Zm11 16H8v-1.5h8V20Z" />
	</SVG>
);

export default stretchFullWidth;
