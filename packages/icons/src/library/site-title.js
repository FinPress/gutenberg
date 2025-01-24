/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const siteTitleIcon = (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<Path d="M4 5h16" /> { /* Horizontal top bar with rounded stroke */ }
		<Path d="M12 7v12" /> { /* Vertical bar for the "T" */ }
	</SVG>
);

export default siteTitleIcon;
