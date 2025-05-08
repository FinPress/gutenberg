/**
 * WordPress dependencies
 */
import { SVG, Rect, Path } from '@wordpress/primitives';
import { Icon, menu } from '@wordpress/icons';

export default function OverlayMenuIcon( { icon } ) {
	if ( icon === 'menu' ) {
		return <Icon icon={ menu } />;
	}

	if ( icon === 'quad-lines' ) {
		return (
			<SVG
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width="24"
				height="24"
				aria-hidden="true"
				focusable="false"
			>
				<Rect x="10" y="17.2" width="14" height="1.6" />
				<Rect x="10" y="13.2" width="14" height="1.6" />
				<Rect x="10" y="9.2" width="14" height="1.6" />
				<Rect x="10" y="5.2" width="14" height="1.6" />
			</SVG>
		);
	}

	if ( icon === 'menu-alt' ) {
		return (
			<SVG
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width="24"
				height="24"
			>
				<Path
					d="M4 6H20M7 12H17M9 18H15"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</SVG>
		);
	}

	if ( icon === 'hamburger-2' ) {
		return (
			<SVG
				width="24"
				height="24"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<Path
					d="M4 17H8M12 17H20M4 12H20M4 7H12M16 7H20"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</SVG>
		);
	}

	if ( icon === 'grid' ) {
		return (
			<SVG
				fill="currentColor"
				width="24"
				height="24"
				viewBox="0 0 16 16"
				xmlns="http://www.w3.org/2000/svg"
			>
				<Path
					d="M0 0h4v4H0V0zm0 6h4v4H0V6zm0 6h4v4H0v-4zM6 0h4v4H6V0zm0 6h4v4H6V6zm0 6h4v4H6v-4zm6-12h4v4h-4V0zm0 6h4v4h-4V6zm0 6h4v4h-4v-4z"
					fill-rule="evenodd"
				/>
			</SVG>
		);
	}

	return (
		<SVG
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="24"
			height="24"
			aria-hidden="true"
			focusable="false"
		>
			<Rect x="4" y="7.5" width="16" height="1.5" />
			<Rect x="4" y="15" width="16" height="1.5" />
		</SVG>
	);
}
