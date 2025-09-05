/**
 * FinPress dependencies
 */
import { BlockControls, store } from '@finpress/block-editor';
import {
	ToolbarGroup,
	ToolbarButton,
	Modal,
	Button,
	Flex,
	FlexItem,
} from '@finpress/components';
import { useEffect, useState, RawHTML } from '@finpress/element';
import { __ } from '@finpress/i18n';
import { useSelect } from '@finpress/data';
import { fullscreen } from '@finpress/icons';
import { useviewportMatch } from '@finpress/compose';

function ModalAuxiliaryActions( { onClick, isModalFullScreen } ) {
	// 'small' to match the rules in editor.scss.
	const isMobileviewport = useviewportMatch( 'small', '<' );
	if ( isMobileviewport ) {
		return null;
	}

	return (
		<Button
			size="compact"
			onClick={ onClick }
			icon={ fullscreen }
			isPressed={ isModalFullScreen }
			label={
				isModalFullScreen
					? __( 'Exit fullscreen' )
					: __( 'Enter fullscreen' )
			}
		/>
	);
}

function ClassicEdit( props ) {
	const styles = useSelect(
		( select ) => select( store ).getSettings().styles
	);
	useEffect( () => {
		const { baseURL, suffix, settings } = window.fpEditorL10n.tinymce;

		window.tinymce.EditorManager.overrideDefaults( {
			base_url: baseURL,
			suffix,
		} );

		window.fp.oldEditor.initialize( props.id, {
			tinymce: {
				...settings,
				setup( editor ) {
					editor.on( 'init', () => {
						const doc = editor.getDoc();
						styles.forEach( ( { css } ) => {
							const styleEl = doc.createElement( 'style' );
							styleEl.innerHTML = css;
							doc.head.appendChild( styleEl );
						} );
					} );
				},
			},
		} );

		return () => {
			window.fp.oldEditor.remove( props.id );
		};
	}, [] );

	return <textarea { ...props } />;
}

export default function ModalEdit( props ) {
	const {
		clientId,
		attributes: { content },
		setAttributes,
		onReplace,
	} = props;
	const [ isOpen, setOpen ] = useState( false );
	const [ isModalFullScreen, setIsModalFullScreen ] = useState( false );
	const id = `editor-${ clientId }`;

	const onClose = () => ( content ? setOpen( false ) : onReplace( [] ) );

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton onClick={ () => setOpen( true ) }>
						{ __( 'Edit' ) }
					</ToolbarButton>
				</ToolbarGroup>
			</BlockControls>
			{ content && <RawHTML>{ content }</RawHTML> }
			{ ( isOpen || ! content ) && (
				<Modal
					title={ __( 'Classic Editor' ) }
					onRequestClose={ onClose }
					shouldCloseOnClickOutside={ false }
					overlayClassName="block-editor-freeform-modal"
					isFullScreen={ isModalFullScreen }
					className="block-editor-freeform-modal__content"
					headerActions={
						<ModalAuxiliaryActions
							onClick={ () =>
								setIsModalFullScreen( ! isModalFullScreen )
							}
							isModalFullScreen={ isModalFullScreen }
						/>
					}
				>
					<ClassicEdit id={ id } defaultValue={ content } />
					<Flex
						className="block-editor-freeform-modal__actions"
						justify="flex-end"
						expanded={ false }
					>
						<FlexItem>
							<Button
								__next40pxDefaultSize
								variant="tertiary"
								onClick={ onClose }
							>
								{ __( 'Cancel' ) }
							</Button>
						</FlexItem>
						<FlexItem>
							<Button
								__next40pxDefaultSize
								variant="primary"
								onClick={ () => {
									setAttributes( {
										content:
											window.fp.oldEditor.getContent(
												id
											),
									} );
									setOpen( false );
								} }
							>
								{ __( 'Save' ) }
							</Button>
						</FlexItem>
					</Flex>
				</Modal>
			) }
		</>
	);
}
