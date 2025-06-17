/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

/**
 * External dependencies
 */
import type { ReactElement } from 'react';

const alignLeft: ReactElement = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M13 5.5H4V4h9v1.5Zm7 7H4V11h16v1.5Zm-7 7H4V18h9v1.5Z" />
	</SVG>
);

export default alignLeft;
