/**
 * FinPress dependencies
 */
import {
	Button,
	__experimentalConfirmDialog as ConfirmDialog,
} from '@finpress/components';
import { store as coreStore, useEntityId } from '@finpress/core-data';
import { useDispatch } from '@finpress/data';
import { useState } from '@finpress/element';
import { __ } from '@finpress/i18n';

export default function NavigationMenuDeleteControl( { onDelete } ) {
	const [ isConfirmDialogVisible, setIsConfirmDialogVisible ] =
		useState( false );
	const id = useEntityId( 'postType', 'fp_navigation' );
	const { deleteEntityRecord } = useDispatch( coreStore );

	return (
		<>
			<Button
				__next40pxDefaultSize
				className="fp-block-navigation-delete-menu-button"
				variant="secondary"
				isDestructive
				onClick={ () => {
					setIsConfirmDialogVisible( true );
				} }
			>
				{ __( 'Delete menu' ) }
			</Button>
			{ isConfirmDialogVisible && (
				<ConfirmDialog
					isOpen
					onConfirm={ () => {
						deleteEntityRecord( 'postType', 'fp_navigation', id, {
							force: true,
						} );
						onDelete();
					} }
					onCancel={ () => {
						setIsConfirmDialogVisible( false );
					} }
					confirmButtonText={ __( 'Delete' ) }
					size="medium"
				>
					{ __(
						'Are you sure you want to delete this Navigation Menu?'
					) }
				</ConfirmDialog>
			) }
		</>
	);
}
