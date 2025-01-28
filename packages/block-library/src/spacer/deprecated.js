/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

const deprecatedSave = ( { attributes } ) => {
	return (
		<div
			{ ...useBlockProps.save( {
				style: {
					height: attributes.height,
					width: attributes.width,
				},
				'aria-hidden': true,
			} ) }
		/>
	);
};

const v2 = {
	attributes: {
		height: {
			type: 'string',
		},
		width: {
			type: 'string',
		},
	},
	isEligible( { height, width } ) {
		return height === undefined && width === undefined;
	},
	migrate( attributes ) {
		return {
			...attributes,
			height: '',
		};
	},
	save: deprecatedSave,
};

const v1 = {
	attributes: {
		height: {
			type: 'number',
			default: 100,
		},
		width: {
			type: 'number',
		},
	},
	migrate( attributes ) {
		const { height, width } = attributes;
		return {
			...attributes,
			width: width !== undefined ? `${ width }px` : undefined,
			height: `${ height }px`,
		};
	},
	save: deprecatedSave,
};

export default [ v2, v1 ];
