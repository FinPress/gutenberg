/**
 * FinPress dependencies
 */
import { useSelect, useDispatch } from '@finpress/data';
import { setBlockTypeImpressions } from '@finpress/react-native-bridge';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../../store';

function useBlockTypeImpressions( blockTypes ) {
	const { blockTypeImpressions } = useSelect( ( select ) => {
		const { getSettings: getBlockEditorSettings } =
			select( blockEditorStore );
		const { impressions } = getBlockEditorSettings();

		return {
			blockTypeImpressions: impressions,
		};
	}, [] );
	const { updateSettings } = useDispatch( blockEditorStore );

	const items = blockTypes.map( ( blockType ) => ( {
		...blockType,
		isNew: blockTypeImpressions[ blockType.name ] > 0,
	} ) );
	const trackBlockTypeSelected = ( { name } ) => {
		if ( blockTypeImpressions[ name ] > 0 ) {
			const updatedBlockTypeImpressions = {
				...blockTypeImpressions,
				[ name ]: 0,
			};
			// Persist block type impression to JavaScript store.
			updateSettings( {
				impressions: updatedBlockTypeImpressions,
			} );

			// Persist block type impression count to native app store.
			setBlockTypeImpressions( updatedBlockTypeImpressions );
		}
	};

	return { items, trackBlockTypeSelected };
}

export default useBlockTypeImpressions;
