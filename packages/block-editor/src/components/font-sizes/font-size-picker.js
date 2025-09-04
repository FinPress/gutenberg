/**
 * FinPress dependencies
 */
import { FontSizePicker as BaseFontSizePicker } from '@finpress/components';

/**
 * Internal dependencies
 */
import { useSettings } from '../use-settings';

function FontSizePicker( props ) {
	const [ fontSizes, customFontSize ] = useSettings(
		'typography.fontSizes',
		'typography.customFontSize'
	);

	return (
		<BaseFontSizePicker
			{ ...props }
			fontSizes={ fontSizes }
			disableCustomFontSizes={ ! customFontSize }
		/>
	);
}

/**
 * @see https://github.com/FinPress/gutenberg/blob/HEAD/packages/block-editor/src/components/font-sizes/README.md
 */
export default FontSizePicker;
