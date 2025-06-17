/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

/**
 * External dependencies
 */
import type { ReactElement } from 'react';

const justifyCenter: ReactElement = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M12.5 15v5H11v-5H4V9h7V4h1.5v5h7v6h-7Z" />
	</SVG>
);

export default justifyCenter;
