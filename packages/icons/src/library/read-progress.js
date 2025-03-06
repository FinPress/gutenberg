/**
 * WordPress dependencies
 */
import { G, Path, SVG } from '@wordpress/primitives';

export default function readProgress() {
	return (
		<SVG
			width="800px"
			height="800px"
			viewBox="0 0 20 20"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
		>
			<G>
				<Path d="M 0 8 L 0 13 L 20 13 L 20 8 L 0 8 z M 1 9 L 19 9 L 19 12 L 1 12 L 1 9 z M 2 10 L 2 11 L 7 11 L 7 10 L 2 10 z " />
			</G>
		</SVG>
	);
}
