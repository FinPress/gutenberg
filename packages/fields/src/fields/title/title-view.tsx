/**
 * WordPress dependencies
 */
import { __experimentalHStack as HStack } from '@wordpress/components';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import type { Settings } from '@wordpress/core-data';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { BasePost } from '../../types';
import { getItemTitle } from '../../actions/utils';

const TitleView = ( { item }: { item: BasePost } ) => {
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
	const [ options, setOptions ] = useState< {
		privacyPolicyPageId: number | null;
		cartPageId: number | null;
		shopPageId: number | null;
		accountPageId: number | null;
		checkoutPageId: number | null;
	} | null >( null );

	useEffect( () => {
		const fetchOptions = async () => {
			try {
				const response = await fetch(
					'/wp-json/page-options/v1/options'
				);
				const data = await response.json();
				setOptions( data );
			} catch ( error ) {}
		};

		fetchOptions();
	}, [] );

	if ( ! options ) {
		return null; // Or a loader while options are being fetched
	}

	const {
		privacyPolicyPageId,
		cartPageId,
		shopPageId,
		accountPageId,
		checkoutPageId,
	} = options;

	const renderedTitle = getItemTitle( item );

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
	} else if ( item.id === Number( privacyPolicyPageId ) ) {
		suffix = (
			<span className="edit-site-post-list__title-badge">
				{ __( 'Privacy Policy' ) }
			</span>
		);
	} else if ( item.id === Number( cartPageId ) ) {
		suffix = (
			<span className="edit-site-post-list__title-badge">
				{ __( 'Cart' ) }
			</span>
		);
	} else if ( item.id === Number( shopPageId ) ) {
		suffix = (
			<span className="edit-site-post-list__title-badge">
				{ __( 'Shop' ) }
			</span>
		);
	} else if ( item.id === Number( accountPageId ) ) {
		suffix = (
			<span className="edit-site-post-list__title-badge">
				{ __( 'Account' ) }
			</span>
		);
	} else if ( item.id === Number( checkoutPageId ) ) {
		suffix = (
			<span className="edit-site-post-list__title-badge">
				{ __( 'Checkout' ) }
			</span>
		);
	} else {
		suffix = null;
	}

	return (
		<HStack
			className="edit-site-post-list__title"
			alignment="center"
			justify="flex-start"
		>
			<span>
				{ decodeEntities( renderedTitle ) || __( '(no title)' ) }
			</span>
			{ suffix }
		</HStack>
	);
};

export default TitleView;
