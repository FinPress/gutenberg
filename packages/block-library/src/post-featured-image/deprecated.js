/**
 * WordPress dependencies
 */
import { privateApis as blockEditorPrivateApis } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { unlock } from '../lock-unlock';

const { cleanEmptyObject } = unlock( blockEditorPrivateApis );

const migrateAspectRatio = ( attributes ) => {
	if ( ! attributes.aspectRatio ) {
		return attributes;
	}
	const { aspectRatio } = attributes;
	return {
		...attributes,
		style: cleanEmptyObject( {
			...attributes.style,
			dimensions: {
				...attributes.style?.dimensions,
				aspectRatio,
			},
		} ),
	};
};

const v1 = {
	attributes: {
		isLink: {
			type: 'boolean',
			default: false,
			role: 'content',
		},
		aspectRatio: {
			type: 'string',
		},
		width: {
			type: 'string',
		},
		height: {
			type: 'string',
		},
		scale: {
			type: 'string',
			default: 'cover',
		},
		sizeSlug: {
			type: 'string',
		},
		rel: {
			type: 'string',
			attribute: 'rel',
			default: '',
			role: 'content',
		},
		linkTarget: {
			type: 'string',
			default: '_self',
			role: 'content',
		},
		overlayColor: {
			type: 'string',
		},
		customOverlayColor: {
			type: 'string',
		},
		dimRatio: {
			type: 'number',
			default: 0,
		},
		gradient: {
			type: 'string',
		},
		customGradient: {
			type: 'string',
		},
		useFirstImageFromPost: {
			type: 'boolean',
			default: false,
		},
	},
	supports: {
		align: [ 'left', 'right', 'center', 'wide', 'full' ],
		color: {
			text: false,
			background: false,
		},
		__experimentalBorder: {
			color: true,
			radius: true,
			width: true,
			__experimentalSkipSerialization: true,
			__experimentalDefaultControls: {
				color: true,
				radius: true,
				width: true,
			},
		},
		filter: {
			duotone: true,
		},
		shadow: {
			__experimentalSkipSerialization: true,
		},
		html: false,
		spacing: {
			margin: true,
			padding: true,
		},
		interactivity: {
			clientNavigation: true,
		},
	},
	save() {
		return null;
	},
	migrate: migrateAspectRatio,
	isEligible( { aspectRatio } ) {
		return aspectRatio;
	},
};
export default [ v1 ];
