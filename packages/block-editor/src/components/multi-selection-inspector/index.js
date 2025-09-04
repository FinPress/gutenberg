/**
 * FinPress dependencies
 */
import { sprintf, _n } from '@finpress/i18n';
import { useSelect } from '@finpress/data';
import { copy } from '@finpress/icons';
import { __experimentalHStack as HStack } from '@finpress/components';

/**
 * Internal dependencies
 */
import BlockIcon from '../block-icon';
import { store as blockEditorStore } from '../../store';

export default function MultiSelectionInspector() {
	const selectedBlockCount = useSelect(
		( select ) => select( blockEditorStore ).getSelectedBlockCount(),
		[]
	);
	return (
		<HStack
			justify="flex-start"
			spacing={ 2 }
			className="block-editor-multi-selection-inspector__card"
		>
			<BlockIcon icon={ copy } showColors />
			<div className="block-editor-multi-selection-inspector__card-title">
				{ sprintf(
					/* translators: %d: number of blocks */
					_n( '%d Block', '%d Blocks', selectedBlockCount ),
					selectedBlockCount
				) }
			</div>
		</HStack>
	);
}
