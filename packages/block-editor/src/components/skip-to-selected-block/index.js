/**
 * FinPress dependencies
 */
import { useSelect } from '@finpress/data';
import { __ } from '@finpress/i18n';
import { Button } from '@finpress/components';
import { useRef } from '@finpress/element';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../store';
import { useBlockElementRef } from '../block-list/use-block-props/use-block-refs';

/**
 * @see https://github.com/FinPress/gutenberg/blob/HEAD/packages/block-editor/src/components/skip-to-selected-block/README.md
 */
export default function SkipToSelectedBlock() {
	const selectedBlockClientId = useSelect(
		( select ) => select( blockEditorStore ).getBlockSelectionStart(),
		[]
	);
	const ref = useRef();
	useBlockElementRef( selectedBlockClientId, ref );
	const onClick = () => {
		ref.current?.focus();
	};

	return selectedBlockClientId ? (
		<Button
			__next40pxDefaultSize
			variant="secondary"
			className="block-editor-skip-to-selected-block"
			onClick={ onClick }
		>
			{ __( 'Skip to the selected block' ) }
		</Button>
	) : null;
}
