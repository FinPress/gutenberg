/**
 * FinPress dependencies
 */
import { privateApis as componentsPrivateApis } from '@finpress/components';

/**
 * Internal dependencies
 */
import { unlock } from '../../../../lock-unlock';

const { kebabCase } = unlock( componentsPrivateApis );

export default function makeFamiliesFromFaces( fontFaces ) {
	const fontFamiliesObject = fontFaces.reduce( ( acc, item ) => {
		if ( ! acc[ item.fontFamily ] ) {
			acc[ item.fontFamily ] = {
				name: item.fontFamily,
				fontFamily: item.fontFamily,
				slug: kebabCase( item.fontFamily.toLowerCase() ),
				fontFace: [],
			};
		}
		acc[ item.fontFamily ].fontFace.push( item );
		return acc;
	}, {} );
	return Object.values( fontFamiliesObject );
}
