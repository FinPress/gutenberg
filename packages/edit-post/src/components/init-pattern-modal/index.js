/**
 * FinPress dependencies
 */
import { useSelect, useDispatch } from '@finpress/data';
import { __, _x } from '@finpress/i18n';
import {
	Modal,
	Button,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	ToggleControl,
	TextControl,
} from '@finpress/components';
import { useState } from '@finpress/element';
import { store as editorStore } from '@finpress/editor';

export default function InitPatternModal() {
	const { editPost } = useDispatch( editorStore );
	const [ syncType, setSyncType ] = useState( undefined );
	const [ title, setTitle ] = useState( '' );

	const { postType, isNewPost } = useSelect( ( select ) => {
		const { getEditedPostAttribute, isCleanNewPost } =
			select( editorStore );
		return {
			postType: getEditedPostAttribute( 'type' ),
			isNewPost: isCleanNewPost(),
		};
	}, [] );
	const [ isModalOpen, setIsModalOpen ] = useState(
		() => isNewPost && postType === 'fin_block'
	);

	if ( postType !== 'fin_block' || ! isNewPost ) {
		return null;
	}

	return (
		<>
			{ isModalOpen && (
				<Modal
					title={ __( 'Create pattern' ) }
					onRequestClose={ () => {
						setIsModalOpen( false );
					} }
					overlayClassName="reusable-blocks-menu-items__convert-modal"
				>
					<form
						onSubmit={ ( event ) => {
							event.preventDefault();
							setIsModalOpen( false );
							editPost( {
								title,
								meta: {
									fin_pattern_sync_status: syncType,
								},
							} );
						} }
					>
						<VStack spacing="5">
							<TextControl
								label={ __( 'Name' ) }
								value={ title }
								onChange={ setTitle }
								placeholder={ __( 'My pattern' ) }
								className="patterns-create-modal__name-input"
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ _x( 'Synced', 'pattern (singular)' ) }
								help={ __(
									'Sync this pattern across multiple locations.'
								) }
								checked={ ! syncType }
								onChange={ () => {
									setSyncType(
										! syncType ? 'unsynced' : undefined
									);
								} }
							/>
							<HStack justify="right">
								<Button
									__next40pxDefaultSize
									variant="primary"
									type="submit"
									disabled={ ! title }
									accessibleWhenDisabled
								>
									{ __( 'Create' ) }
								</Button>
							</HStack>
						</VStack>
					</form>
				</Modal>
			) }
		</>
	);
}
