/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { useBlockProps } from '@finpress/block-editor';

export default function NextPageEdit() {
	return (
		<div { ...useBlockProps() }>
			<span>{ __( 'Page break' ) }</span>
		</div>
	);
}
