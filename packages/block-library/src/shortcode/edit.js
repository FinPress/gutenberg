/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { PlainText, useBlockProps } from '@finpress/block-editor';
import { useInstanceId } from '@finpress/compose';
import { Placeholder } from '@finpress/components';
import { shortcode } from '@finpress/icons';

export default function ShortcodeEdit( { attributes, setAttributes } ) {
	const instanceId = useInstanceId( ShortcodeEdit );
	const inputId = `blocks-shortcode-input-${ instanceId }`;

	return (
		<div { ...useBlockProps() }>
			<Placeholder icon={ shortcode } label={ __( 'Shortcode' ) }>
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
