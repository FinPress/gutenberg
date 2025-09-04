/**
 * FinPress dependencies
 */
import { RawHTML } from '@finpress/element';

export default function save( { attributes: { customText, noTeaser } } ) {
	const moreTag = customText ? `<!--more ${ customText }-->` : '<!--more-->';

	const noTeaserTag = noTeaser ? '<!--noteaser-->' : '';

	return (
		<RawHTML>
			{ [ moreTag, noTeaserTag ].filter( Boolean ).join( '\n' ) }
		</RawHTML>
	);
}
