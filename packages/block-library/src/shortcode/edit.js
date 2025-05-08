/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	PlainText,
	useBlockProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useInstanceId } from '@wordpress/compose';
import { Placeholder, Button, Notice } from '@wordpress/components';
import { shortcode } from '@wordpress/icons';
import { createBlock } from '@wordpress/blocks';
import { useDispatch } from '@wordpress/data';
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { isEmbedShortcode, extractEmbedUrl } from './utils';

export default function ShortcodeEdit( {
	attributes,
	setAttributes,
	clientId,
} ) {
	const instanceId = useInstanceId( ShortcodeEdit );
	const inputId = `blocks-shortcode-input-${ instanceId }`;
	const { replaceBlock } = useDispatch( blockEditorStore );

	const { hasEmbed, embedUrl } = useMemo( () => {
		const isEmbed = isEmbedShortcode( attributes.text );
		const url = isEmbed ? extractEmbedUrl( attributes.text ) : '';
		return { hasEmbed: isEmbed, embedUrl: url };
	}, [ attributes.text ] );

	/**
	 * Converts the shortcode block to an embed block.
	 *
	 * Creates a new embed block with the extracted URL and replaces
	 * the current shortcode block with it.
	 */
	const convertToEmbed = () => {
		const embedBlock = createBlock( 'core/embed', { url: embedUrl } );
		replaceBlock( clientId, embedBlock );
	};

	return (
		<div { ...useBlockProps() }>
			<Placeholder icon={ shortcode } label={ __( 'Shortcode' ) }>
				{ hasEmbed && (
					<Notice
						className="blocks-shortcode__notice"
						status="info"
						isDismissible={ false }
					>
						{ __(
							'This embed shortcode can be converted to an embed block for a better editing experience with preview.'
						) }
						{ embedUrl && (
							<p className="blocks-shortcode__url-preview">
								{ __( 'Source:' ) } { embedUrl }
							</p>
						) }
						<div className="blocks-shortcode__convert-button-wrapper">
							<Button
								variant="primary"
								__next40pxDefaultSize
								onClick={ convertToEmbed }
								className="blocks-shortcode__convert-button"
								aria-label={ __(
									'Convert shortcode to embed block with preview'
								) }
							>
								{ __( 'Convert to embed block' ) }
							</Button>
						</div>
					</Notice>
				) }
				<PlainText
					className="blocks-shortcode__textarea"
					id={ inputId }
					value={ attributes.text }
					aria-label={ __( 'Shortcode text' ) }
					placeholder={ __( 'Write shortcode here…' ) }
					onChange={ ( text ) => setAttributes( { text } ) }
				/>
			</Placeholder>
		</div>
	);
}
