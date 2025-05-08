/**
 * WordPress dependencies
 */
import { removep, autop } from '@wordpress/autop';
import { createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { isEmbedShortcode, extractEmbedUrl } from './utils';

const transforms = {
	from: [
		{
			type: 'shortcode',
			// Per "Shortcode names should be all lowercase and use all
			// letters, but numbers and underscores should work fine too.
			// Be wary of using hyphens (dashes), you'll be better off not
			// using them." in https://codex.wordpress.org/Shortcode_API
			// Require that the first character be a letter. This notably
			// prevents footnote markings ([1]) from being caught as
			// shortcodes.
			tag: '[a-z][a-z0-9_-]*',
			attributes: {
				text: {
					type: 'string',
					shortcode: ( attrs, { content } ) => {
						return removep( autop( content ) );
					},
				},
			},
			priority: 20,
		},
	],
	to: [
		{
			type: 'block',
			blocks: [ 'core/embed' ],
			isMatch: ( { text } ) => isEmbedShortcode( text ),
			transform: ( { text } ) => {
				const url = extractEmbedUrl( text );
				return createBlock( 'core/embed', { url } );
			},
		},
	],
};

export default transforms;
