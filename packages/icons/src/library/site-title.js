/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const siteTitleIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M4 4h16v2H4z" /> { /* Horizontal top bar for the title */ }
		<Path d="M10 6v12h4V6h-4z" />{ ' ' }
		{ /* Vertical bar representing the "T" */ }
	</SVG>
);

export default siteTitleIcon;
