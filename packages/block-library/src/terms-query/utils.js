/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { store as blocksStore } from '@wordpress/blocks';

/**
 * Helper hook that determines if there is an active variation of the block
 * and if there are available specific scoped `block` variations connected with
 * this variation.
 *
 * @param {Object} attributes The block's attributes.
 * @return {Array} The block variations to be suggested in setup flow, when clicking to `start blank`.
 */
export function useScopedBlockVariations( attributes ) {
	const { activeVariationName, blockVariations } = useSelect(
		( select ) => {
			const { getActiveBlockVariation, getBlockVariations } =
				select( blocksStore );
			return {
				activeVariationName: getActiveBlockVariation(
					'core/terms-query',
					attributes
				)?.name,
				blockVariations: getBlockVariations(
					'core/terms-query',
					'block'
				),
			};
		},
		[ attributes ]
	);
	const variations = useMemo( () => {
		// Filter out the variations that have defined a `namespace` attribute,
		// which means they are 'connected' to specific variations of the block.
		const isNotConnected = ( variation ) =>
			! variation.attributes?.namespace;
		if ( ! activeVariationName ) {
			return blockVariations.filter( isNotConnected );
		}
		const connectedVariations = blockVariations.filter( ( variation ) =>
			variation.attributes?.namespace?.includes( activeVariationName )
		);
		if ( !! connectedVariations.length ) {
			return connectedVariations;
		}
		return blockVariations.filter( isNotConnected );
	}, [ activeVariationName, blockVariations ] );
	return variations;
}
