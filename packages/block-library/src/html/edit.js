/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { useContext, useState } from '@finpress/element';
import {
	BlockControls,
	PlainText,
	useBlockProps,
	store as blockEditorStore,
} from '@finpress/block-editor';
import {
	ToolbarButton,
	Disabled,
	ToolbarGroup,
	VisuallyHidden,
} from '@finpress/components';
import { useSelect } from '@finpress/data';
import { useInstanceId } from '@finpress/compose';

/**
 * Internal dependencies
 */
import Preview from './preview';

export default function HTMLEdit( { attributes, setAttributes, isSelected } ) {
	const [ isPreview, setIsPreview ] = useState();
	const isDisabled = useContext( Disabled.Context );

	const instanceId = useInstanceId( HTMLEdit, 'html-edit-desc' );

	const isPreviewMode = useSelect( ( select ) => {
		return select( blockEditorStore ).getSettings().isPreviewMode;
	}, [] );

	function switchToPreview() {
		setIsPreview( true );
	}

	function switchToHTML() {
		setIsPreview( false );
	}

	const blockProps = useBlockProps( {
		className: 'block-library-html__edit',
		'aria-describedby': isPreview ? instanceId : undefined,
	} );

	return (
		<div { ...blockProps }>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						isPressed={ ! isPreview }
						onClick={ switchToHTML }
					>
						HTML
					</ToolbarButton>
					<ToolbarButton
						isPressed={ isPreview }
						onClick={ switchToPreview }
					>
						{ __( 'Preview' ) }
					</ToolbarButton>
				</ToolbarGroup>
			</BlockControls>
			{ isPreview || isPreviewMode || isDisabled ? (
				<>
					<Preview
						content={ attributes.content }
						isSelected={ isSelected }
					/>
					<VisuallyHidden id={ instanceId }>
						{ __(
							'HTML preview is not yet fully accessible. Please switch screen reader to virtualized mode to navigate the below iFrame.'
						) }
					</VisuallyHidden>
				</>
			) : (
				<PlainText
					value={ attributes.content }
					onChange={ ( content ) => setAttributes( { content } ) }
					placeholder={ __( 'Write HTML…' ) }
					aria-label={ __( 'HTML' ) }
				/>
			) }
		</div>
	);
}
