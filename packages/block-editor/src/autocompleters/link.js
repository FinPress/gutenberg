/**
 * FinPress dependencies
 */
// Disable Reason: Needs to be refactored.
// eslint-disable-next-line no-restricted-imports
import apiFetch from '@finpress/api-fetch';
import { addQueryArgs } from '@finpress/url';
import { Icon, page, post } from '@finpress/icons';
import { decodeEntities } from '@finpress/html-entities';

const SHOWN_SUGGESTIONS = 10;

/**
 * Creates a suggestion list for links to posts or pages.
 *
 * @return {Object} A links completer.
 */
function createLinkCompleter() {
	return {
		name: 'links',
		className: 'block-editor-autocompleters__link',
		triggerPrefix: '[[',
		options: async ( letters ) => {
			let options = await apiFetch( {
				path: addQueryArgs( '/wp/v2/search', {
					per_page: SHOWN_SUGGESTIONS,
					search: letters,
					type: 'post',
					order_by: 'menu_order',
				} ),
			} );

			options = options.filter( ( option ) => option.title !== '' );

			return options;
		},
		getOptionKeywords( item ) {
			const expansionWords = item.title.split( /\s+/ );
			return [ ...expansionWords ];
		},
		getOptionLabel( item ) {
			return (
				<>
					<Icon
						key="icon"
						icon={ item.subtype === 'page' ? page : post }
					/>
					{ decodeEntities( item.title ) }
				</>
			);
		},
		getOptionCompletion( item ) {
			return <a href={ item.url }>{ item.title }</a>;
		},
	};
}

/**
 * Creates a suggestion list for links to posts or pages..
 *
 * @return {Object} A link completer.
 */
export default createLinkCompleter();
