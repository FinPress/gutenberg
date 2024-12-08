/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import { privateApis as routerPrivateApis } from '@wordpress/router';
import { useNavigator } from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';
import StyleBook from '../style-book';
import { STYLE_BOOK_COLOR_GROUPS } from '../style-book/constants';

const { useLocation, useHistory } = unlock( routerPrivateApis );

function useGetCanvasContext() {
	// View mode browser query params and location.
	const { path: locationPath, query } = useLocation();
	const history = useHistory();

	// Edit mode (editor) Global styles menu router.
	const { location, goTo } = useNavigator();

	return useMemo( () => {
		if ( 'edit' === query?.canvas && location?.path ) {
			return [
				location.path ?? '/',
				( updatedSection ) => goTo( updatedSection ),
				{},
			];
		}

		return [
			query?.section ?? '/',
			( updatedSection ) =>
				history.navigate(
					addQueryArgs( locationPath, {
						section: updatedSection,
					} )
				),
			{
				enableResizing: false,
				showCloseButton: false,
				showTabs: false,
			},
		];
	}, [
		locationPath,
		location?.path,
		query?.section,
		query?.canvas,
		history,
		goTo,
	] );
}

export default function GlobalStylesStyleBook( props ) {
	const [ path, onChangeSection, contextProps ] = useGetCanvasContext();

	return (
		<StyleBook
			{ ...contextProps }
			{ ...props }
			isSelected={ ( blockName ) =>
				// Match '/blocks/core%2Fbutton' and
				// '/blocks/core%2Fbutton/typography', but not
				// '/blocks/core%2Fbuttons'.
				path === `/blocks/${ encodeURIComponent( blockName ) }` ||
				path.startsWith(
					`/blocks/${ encodeURIComponent( blockName ) }/`
				)
			}
			onSelect={ ( blockName ) => {
				if (
					STYLE_BOOK_COLOR_GROUPS.find(
						( group ) => group.slug === blockName
					)
				) {
					// Go to color palettes Global Styles.
					onChangeSection( '/colors/palette' );
					return;
				}
				if ( blockName === 'typography' ) {
					// Go to typography Global Styles.
					onChangeSection( '/typography' );
					return;
				}

				// Now go to the selected block.
				onChangeSection(
					`/blocks/${ encodeURIComponent( blockName ) }`
				);
			} }
		/>
	);
}
