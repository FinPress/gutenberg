/**
 * WordPress dependencies
 */
import { store as coreStore } from '@wordpress/core-data';
import { __, sprintf } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import type { Action } from '@wordpress/dataviews';
import { trash } from '@wordpress/icons';
import { Modal, Button, ButtonGroup } from '@wordpress/components';
import { createRoot } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getItemTitle, isTemplateOrTemplatePart } from './utils';
import type { CoreDataError, PostWithPermissions } from '../types';

interface ConfirmModalProps {
	posts: PostWithPermissions[];
	onConfirm: () => void;
	onCancel: () => void;
}

const ConfirmModal = ( { posts, onConfirm, onCancel }: ConfirmModalProps ) => (
	<Modal
		title={ __( 'Confirm Deletion' ) }
		onRequestClose={ onCancel }
		className="permanently-delete-modal"
	>
		<p>
			{ posts.length === 1
				? sprintf(
						/* translators: The post's title. */
						__(
							'Are you sure you want to permanently delete "%s"?'
						),
						getItemTitle( posts[ 0 ] )
				  )
				: __(
						'Are you sure you want to permanently delete these items?'
				  ) }
		</p>
		<ButtonGroup className="permanently-delete-modal__actions">
			<Button
				variant="secondary"
				onClick={ onCancel }
				__next40pxDefaultSize
				style={ { marginRight: '10px' } }
			>
				{ __( 'Cancel' ) }
			</Button>

			<Button
				variant="primary"
				onClick={ onConfirm }
				isPrimary
				__next40pxDefaultSize
			>
				{ __( 'Delete' ) }
			</Button>
		</ButtonGroup>
	</Modal>
);

const permanentlyDeletePost: Action< PostWithPermissions > = {
	id: 'permanently-delete',
	label: __( 'Permanently delete' ),
	supportsBulk: true,
	icon: trash,
	isEligible( item ) {
		if ( isTemplateOrTemplatePart( item ) || item.type === 'wp_block' ) {
			return false;
		}
		const { status, permissions } = item;
		return status === 'trash' && permissions?.delete;
	},
	async callback( posts, { registry, onActionPerformed } ) {
		const { createSuccessNotice, createErrorNotice } =
			registry.dispatch( noticesStore );
		const { deleteEntityRecord } = registry.dispatch( coreStore );

		// Wrap logic in a Promise resolved by modal interaction
		return new Promise< void >( ( resolve ) => {
			// Setup modal container
			const container = document.createElement( 'div' );
			document.body.appendChild( container );
			const root = createRoot( container );
			const cleanup = () => {
				root.unmount();
				document.body.removeChild( container );
			};

			const handleConfirm = async () => {
				cleanup();
				const promiseResult = await Promise.allSettled(
					posts.map( ( post ) =>
						deleteEntityRecord(
							'postType',
							post.type,
							post.id,
							{ force: true },
							{ throwOnError: true }
						)
					)
				);

				// If all the promises were fulfilled with success.
				if (
					promiseResult.every(
						( { status } ) => status === 'fulfilled'
					)
				) {
					let successMessage;
					if ( promiseResult.length === 1 ) {
						successMessage = sprintf(
							/* translators: The posts's title. */
							__( '"%s" permanently deleted.' ),
							getItemTitle( posts[ 0 ] )
						);
					} else {
						successMessage = __(
							'The items were permanently deleted.'
						);
					}
					createSuccessNotice( successMessage, {
						type: 'snackbar',
						id: 'permanently-delete-post-action',
					} );
					onActionPerformed?.( posts );
				} else {
					// If there was at lease one failure.
					let errorMessage;
					// If we were trying to permanently delete a single post.
					if ( promiseResult.length === 1 ) {
						const typedError = promiseResult[ 0 ] as {
							reason?: CoreDataError;
						};
						if ( typedError.reason?.message ) {
							errorMessage = typedError.reason.message;
						} else {
							errorMessage = __(
								'An error occurred while permanently deleting the item.'
							);
						}
						// If we were trying to permanently delete multiple posts
					} else {
						const errorMessages = new Set();
						const failedPromises = promiseResult.filter(
							( { status } ) => status === 'rejected'
						);
						for ( const failedPromise of failedPromises ) {
							const typedError = failedPromise as {
								reason?: CoreDataError;
							};
							if ( typedError.reason?.message ) {
								errorMessages.add( typedError.reason.message );
							}
						}
						if ( errorMessages.size === 0 ) {
							errorMessage = __(
								'An error occurred while permanently deleting the items.'
							);
						} else if ( errorMessages.size === 1 ) {
							errorMessage = sprintf(
								/* translators: %s: an error message */
								__(
									'An error occurred while permanently deleting the items: %s'
								),
								[ ...errorMessages ][ 0 ]
							);
						} else {
							errorMessage = sprintf(
								/* translators: %s: a list of comma separated error messages */
								__(
									'Some errors occurred while permanently deleting the items: %s'
								),
								[ ...errorMessages ].join( ',' )
							);
						}
					}
					createErrorNotice( errorMessage, {
						type: 'snackbar',
					} );
				}
			};

			const handleCancel = () => {
				cleanup();
				resolve();
			};

			// Render the modal
			root.render(
				<ConfirmModal
					posts={ posts }
					onConfirm={ handleConfirm }
					onCancel={ handleCancel }
				/>
			);
		} );
	},
};

/**
 * Delete action for PostWithPermissions.
 */
export default permanentlyDeletePost;
