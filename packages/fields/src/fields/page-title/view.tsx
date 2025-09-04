/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { useSelect } from '@finpress/data';
import { store as coreStore } from '@finpress/core-data';
import type { Settings } from '@finpress/core-data';
import { privateApis as componentsPrivateApis } from '@finpress/components';

/**
 * Internal dependencies
 */
import type { CommonPost } from '../../types';
import { BaseTitleView } from '../title/view';
import { unlock } from '../../lock-unlock';
const { Badge } = unlock( componentsPrivateApis );

export default function PageTitleView( { item }: { item: CommonPost } ) {
	const { frontPageId, postsPageId } = useSelect( ( select ) => {
		const { getEntityRecord } = select( coreStore );
		const siteSettings = getEntityRecord(
			'root',
			'site'
		) as Partial< Settings >;
		return {
			frontPageId: siteSettings?.page_on_front,
			postsPageId: siteSettings?.page_for_posts,
		};
	}, [] );
	return (
		<BaseTitleView item={ item } className="fields-field__page-title">
			{ [ frontPageId, postsPageId ].includes( item.id as number ) && (
				<Badge>
					{ item.id === frontPageId
						? __( 'Homepage' )
						: __( 'Posts Page' ) }
				</Badge>
			) }
		</BaseTitleView>
	);
}
