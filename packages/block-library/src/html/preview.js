/**
 * FinPress dependencies
 */
import { useMemo } from '@finpress/element';
import {
	transformStyles,
	store as blockEditorStore,
} from '@finpress/block-editor';
import { SandBox } from '@finpress/components';
import { useSelect } from '@finpress/data';
import { __ } from '@finpress/i18n';

// Default styles used to unset some of the styles
// that might be inherited from the editor style.
const DEFAULT_STYLES = `
	html,body,:root {
		margin: 0 !important;
		padding: 0 !important;
		overflow: visible !important;
		min-height: auto !important;
	}
`;

export default function HTMLEditPreview( { content, isSelected } ) {
	const settingStyles = useSelect(
		( select ) => select( blockEditorStore ).getSettings().styles,
		[]
	);

	const styles = useMemo(
		() => [
			DEFAULT_STYLES,
			...transformStyles(
				( settingStyles ?? [] ).filter( ( style ) => style.css )
			),
		],
		[ settingStyles ]
	);

	return (
		<>
			<SandBox
				html={ content }
				styles={ styles }
				title={ __( 'Custom HTML Preview' ) }
				tabIndex={ -1 }
			/>
			{ /*
				An overlay is added when the block is not selected in order to register click events.
				Some browsers do not bubble up the clicks from the sandboxed iframe, which makes it
				difficult to reselect the block.
			*/ }
			{ ! isSelected && (
				<div className="block-library-html__preview-overlay"></div>
			) }
		</>
	);
}
