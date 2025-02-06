/**
 * WordPress dependencies
 */
import { trash } from '@wordpress/icons';
import { useDispatch, select } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { __, _n, sprintf, _x } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { useState, useEffect } from '@wordpress/element';
import {
	Button,
	__experimentalText as Text,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	SelectControl,
} from '@wordpress/components';
import type { Action } from '@wordpress/dataviews';

/**
 * Internal dependencies
 */
import { isTemplateOrTemplatePart } from './utils';
import type { PostWithPermissions } from '../types';

declare global {
	interface Window {
		wpApiSettings: {
			nonce: string;
		};
	}
}

const trashPost: Action< PostWithPermissions > = {
	id: 'move-to-trash',
	label: __( 'Move to trash' ),
	isPrimary: true,
	icon: trash,
	isEligible( item ) {
		if ( isTemplateOrTemplatePart( item ) || item.type === 'wp_block' ) {
			return false;
		}

		return (
			!! item.status &&
			! [ 'auto-draft', 'trash' ].includes( item.status ) &&
			item.permissions?.delete
		);
	},
	supportsBulk: true,
	hideModalHeader: true,
	RenderModal: ( { items, closeModal, onActionPerformed } ) => {
		const [ isBusy, setIsBusy ] = useState( false );
		const [ availablePages, setAvailablePages ] = useState<
			Array< { id: number; title: { rendered: string } } >
		>( [] );
		const [ selectedHomepage, setSelectedHomepage ] = useState<
			string | undefined
		>( '' );
		const [ selectedPostsPage, setSelectedPostsPage ] = useState<
			string | undefined
		>( '' );
		const [ selectedPrivacyPolicyPage, setSelectedPrivacyPolicyPage ] =
			useState< string | undefined >( '' );

		const { createSuccessNotice, createErrorNotice } =
			useDispatch( noticesStore );
		const { saveEntityRecord, deleteEntityRecord } =
			useDispatch( coreStore );

		// Fetch front page and posts page IDs
		const frontPageId = (
			select( coreStore ).getEntityRecord( 'root', 'site' ) as {
				page_on_front?: number;
			}
		 )?.page_on_front;

		const postsPageId = (
			select( coreStore ).getEntityRecord( 'root', 'site' ) as {
				page_for_posts?: number;
			}
		 )?.page_for_posts;

		const [ options, setOptions ] = useState< {
			privacyPolicyPageId: number | null;
		} | null >( null );

		const privacyPolicyPageId = options?.privacyPolicyPageId;

		const isTrashingHomePage = items.some(
			( item ) => item.id === frontPageId
		);
		const isTrashingPostsPage = items.some(
			( item ) => item.id === postsPageId
		);

		const isTrashingPrivacyPolicyPage = items.some(
			( item ) => Number( item.id ) === Number( privacyPolicyPageId )
		);
		// Fetch available pages excluding the trashed one and posts page for homepage dropdown
		useEffect( () => {
			const fetchPages = async () => {
				const pages = await select( coreStore ).getEntityRecords< {
					id: number;
					title: { rendered: string };
				} >( 'postType', 'page', { per_page: -1 } );
				setAvailablePages(
					pages?.filter( ( page ) => {
						const isTrashedPage = items.some(
							( item ) => item.id === page.id
						);
						const isExcludedForHomepage =
							( isTrashingHomePage && page.id === postsPageId ) ||
							page.id === frontPageId ||
							page.id === privacyPolicyPageId;
						return ! isTrashedPage && ! isExcludedForHomepage;
					} ) || []
				);
			};
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
			fetchPages();
		}, [
			items,
			isTrashingHomePage,
			postsPageId,
			frontPageId,
			privacyPolicyPageId,
		] );

		interface UpdatePrivacyPolicyPageResponse {
			newPageId: number;
			error?: string;
		}

		const updatePrivacyPolicyPage = async (
			newSelectedPrivacyPolicyPage: string
		): Promise< void > => {
			try {
				const response: Response = await fetch(
					'/wp-json/page-options/v1/update-privacy-page',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'X-WP-Nonce': (
								window.wpApiSettings as { nonce: string }
							 ).nonce, // Ensure nonce is available and passed
						},
						body: JSON.stringify( {
							page_id: parseInt(
								newSelectedPrivacyPolicyPage,
								10
							),
						} ),
					}
				);

				const result: UpdatePrivacyPolicyPageResponse =
					await response.json();

				if ( ! response.ok ) {
					throw new Error(
						result.error || 'Failed to update Privacy Policy page'
					);
				}
			} catch ( error ) {
				createErrorNotice(
					__(
						'An error occurred while updating the privacy policy page.'
					),
					{ type: 'snackbar' }
				);
			}
		};

		const handleDelete = async () => {
			setIsBusy( true );
			try {
				// Update site settings for homepage or posts page
				if ( isTrashingHomePage && selectedHomepage ) {
					await saveEntityRecord( 'root', 'site', {
						page_on_front: parseInt( selectedHomepage, 10 ),
					} );
				}
				if ( isTrashingPostsPage && selectedPostsPage ) {
					await saveEntityRecord( 'root', 'site', {
						page_for_posts: parseInt( selectedPostsPage, 10 ),
					} );
				}

				if (
					isTrashingPrivacyPolicyPage &&
					selectedPrivacyPolicyPage
				) {
					await updatePrivacyPolicyPage( selectedPrivacyPolicyPage );
				}

				// Perform delete actions
				const promiseResult = await Promise.allSettled(
					items.map( ( item ) =>
						deleteEntityRecord(
							'postType',
							item.type,
							item.id.toString(),
							{},
							{ throwOnError: true }
						)
					)
				);

				if (
					promiseResult.every(
						( { status } ) => status === 'fulfilled'
					)
				) {
					const successMessage =
						promiseResult.length === 1
							? sprintf(
									// translators: %s: The item's title.
									__( '"%s" moved to the trash.' ),
									typeof items[ 0 ].title === 'object' &&
										'rendered' in items[ 0 ].title
										? items[ 0 ].title.rendered
										: items[ 0 ].title
							  )
							: sprintf(
									// translators: %d: number of items to move to the trash.
									_n(
										'%s item moved to the trash.',
										'%s items moved to the trash.',
										items.length
									),
									items.length
							  );
					createSuccessNotice( successMessage, {
						type: 'snackbar',
						id: 'move-to-trash-action',
					} );
				} else {
					createErrorNotice(
						__(
							'An error occurred while moving the items to the trash.'
						),
						{ type: 'snackbar' }
					);
				}

				if ( onActionPerformed ) {
					onActionPerformed( items );
				}
			} catch ( error ) {
				createErrorNotice(
					__( 'An error occurred while deleting the item.' ),
					{ type: 'snackbar' }
				);
			} finally {
				setIsBusy( false );
				closeModal?.();
			}
		};

		return (
			<VStack spacing="5">
				<Text>
					{ items.length === 1
						? sprintf(
								// translators: %s: The item's title.
								__(
									'Are you sure you want to move "%s" to the trash?'
								),
								typeof items[ 0 ]?.title === 'object' &&
									'rendered' in items[ 0 ].title
									? items[ 0 ].title.rendered
									: items[ 0 ]?.title || ''
						  )
						: sprintf(
								// translators: %d: The number of items (2 or more).
								_n(
									'Are you sure you want to move %d item to the trash ?',
									'Are you sure you want to move %d items to the trash ?',
									items.length
								),
								items.length
						  ) }
				</Text>
				{ ( isTrashingHomePage ||
					isTrashingPostsPage ||
					isTrashingPrivacyPolicyPage ) &&
					availablePages.length > 0 && (
						<>
							{ isTrashingHomePage && (
								<SelectControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={ __( 'Choose a new homepage' ) }
									value={ selectedHomepage }
									options={ [
										{
											value: '',
											label: __( 'Select a page' ),
										},
										...availablePages.map( ( page ) => ( {
											value: page.id.toString(),
											label:
												page.title.rendered ||
												__( '(no title)' ),
										} ) ),
									] }
									onChange={ ( value ) =>
										setSelectedHomepage( value )
									}
								/>
							) }
							{ isTrashingPostsPage && (
								<SelectControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={ __( 'Choose a new posts page' ) }
									value={ selectedPostsPage }
									options={ [
										{
											value: '',
											label: __( 'Select a page' ),
										},
										...availablePages.map( ( page ) => ( {
											value: page.id.toString(),
											label:
												page.title.rendered ||
												__( '(no title)' ),
										} ) ),
									] }
									onChange={ ( value ) =>
										setSelectedPostsPage( value )
									}
								/>
							) }
							{ isTrashingPrivacyPolicyPage && (
								<SelectControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={ __(
										'Choose a new privacy policy page'
									) }
									value={ selectedPrivacyPolicyPage }
									options={ [
										{
											value: '',
											label: __( 'Select a page' ),
										},
										...availablePages.map( ( page ) => ( {
											value: page.id.toString(),
											label:
												page.title.rendered ||
												__( '(no title)' ),
										} ) ),
									] }
									onChange={ ( value ) =>
										setSelectedPrivacyPolicyPage( value )
									}
								/>
							) }
						</>
					) }
				<HStack justify="right">
					<Button
						__next40pxDefaultSize
						variant="tertiary"
						onClick={ closeModal }
						disabled={ isBusy }
						accessibleWhenDisabled
					>
						{ __( 'Cancel' ) }
					</Button>
					<Button
						__next40pxDefaultSize
						accessibleWhenDisabled
						variant="primary"
						isBusy={ isBusy }
						disabled={
							isBusy ||
							( isTrashingHomePage && ! selectedHomepage ) ||
							( isTrashingPostsPage && ! selectedPostsPage ) ||
							( isTrashingPrivacyPolicyPage &&
								! selectedPrivacyPolicyPage )
						}
						onClick={ handleDelete }
					>
						{ _x( 'Trash', 'verb' ) }
					</Button>
				</HStack>
			</VStack>
		);
	},
};

/**
 * Trash action for PostWithPermissions.
 */
export default trashPost;
