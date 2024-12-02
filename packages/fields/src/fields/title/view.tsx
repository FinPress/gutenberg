/**
 * External dependencies
 */
import type { ReactNode } from 'react';

/**
 * WordPress dependencies
 */
import { __experimentalHStack as HStack } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { CommonPost } from '../../types';
import { getItemTitle } from '../../actions/utils';

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
			className="fields-title-field"
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
