/**
 * External dependencies
 */
import type { ReactNode } from 'react';

/**
 * WordPress dependencies
 */
import { __experimentalHStack as HStack } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import type { Settings } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import type { CommonPost } from '../../types';
import { getItemTitle } from '../../actions/utils';

export function PostTitleView( { item }: { item: CommonPost } ) {
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
	let suffix;
	if ( item.id === frontPageId ) {
		suffix = (
			<span className="edit-site-post-list__title-badge">
				{ __( 'Homepage' ) }
			</span>
		);
	} else if ( item.id === postsPageId ) {
		suffix = (
			<span className="edit-site-post-list__title-badge">
				{ __( 'Posts Page' ) }
			</span>
		);
	}
	return <BaseTitleView item={ item }>{ suffix }</BaseTitleView>;
}

export function BaseTitleView( {
	item,
	children,
}: {
	item: CommonPost;
	children?: ReactNode;
} ) {
	const renderedTitle = getItemTitle( item );
	return (
		<HStack
			className="edit-site-post-list__title"
			alignment="center"
			justify="flex-start"
		>
			<span>{ renderedTitle || __( '(no title)' ) }</span>
			{ children }
		</HStack>
	);
}

export default function TitleView( { item }: { item: CommonPost } ) {
	return <BaseTitleView item={ item } />;
}
