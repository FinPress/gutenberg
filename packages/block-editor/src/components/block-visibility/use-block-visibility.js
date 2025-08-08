/**
 * WordPress dependencies
 */
import { hasBlockSupport } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../store';

export default function useBlockVisibility( clientId ) {
	return useSelect(
		( select ) => {
			const { getBlockName, getBlockAttributes } =
				select( blockEditorStore );
			return {
				canToggleBlockVisibility: hasBlockSupport(
					getBlockName( clientId ),
					'blockVisibility',
					true
				),
				isBlockVisible:
					getBlockAttributes( clientId )?.metadata
						?.blockVisibility !== false,
			};
		},
		[ clientId ]
	);
}
