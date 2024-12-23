/**
 * WordPress dependencies
 */
import { sprintf, _n, _x } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { copy } from '@wordpress/icons';
import {
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	privateApis as componentsPrivateApis,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import BlockIcon from '../block-icon';
import { store as blockEditorStore } from '../../store';
import { unlock } from '../../lock-unlock';

const { Badge } = unlock( componentsPrivateApis );

export default function MultiSelectionInspector() {
	const { selectedBlockCount, isUsingBindings } = useSelect( ( select ) => {
		const {
			getSelectedBlockCount,
			getBlockAttributes,
			getSelectedBlockClientIds,
		} = select( blockEditorStore );

		return {
			selectedBlockCount: getSelectedBlockCount(),
			isUsingBindings: getSelectedBlockClientIds().every(
				( clientId ) =>
					!! getBlockAttributes( clientId )?.metadata?.bindings
			),
		};
	}, [] );

	return (
		<HStack
			justify="flex-start"
			align="flex-start"
			spacing={ 0 }
			className="block-editor-multi-selection-inspector__card"
		>
			<BlockIcon icon={ copy } showColors />
			<VStack spacing={ 1 }>
				<h2 className="block-editor-multi-selection-inspector__card-title">
					{ sprintf(
						/* translators: %d: number of blocks */
						_n( '%d Block', '%d Blocks', selectedBlockCount ),
						selectedBlockCount
					) }
					{ isUsingBindings && (
						<Badge>
							{ _x(
								'Connected',
								'multiple blocks connected to a bound source'
							) }
						</Badge>
					) }
				</h2>
			</VStack>
		</HStack>
	);
}
