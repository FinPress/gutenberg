/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as blocksStore } from '@wordpress/blocks';
import {
	__experimentalHStack as HStack,
	__unstableMotion as motion,
} from '@wordpress/components';
import { useReducedMotion } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { useBlockProps } from '../block-list/use-block-props';
import { store as blockEditorStore } from '../../store';
import BlockIcon from '../block-icon';

/**
 * Renders a small placeholder for hidden blocks.
 * This maintains block structure while providing visual feedback about the hidden block's presence.
 *
 * @param {Object} props          Component props.
 * @param {string} props.clientId The block client ID.
 * @return {JSX.Element} Block placeholder component.
 */
function HiddenBlockPlaceholder( { clientId } ) {
	const { blockType, blockAttributes } = useSelect(
		( select ) => {
			const { getBlockName, getBlockAttributes } =
				select( blockEditorStore );
			const { getBlockType } = select( blocksStore );
			const blockName = getBlockName( clientId );
			return {
				blockType: getBlockType( blockName ),
				blockAttributes: getBlockAttributes( clientId ),
			};
		},
		[ clientId ]
	);

	const disableMotion = useReducedMotion();
	const label = blockAttributes?.metadata?.name || blockType?.title;
	const align =
		blockAttributes.align &&
		[ 'wide', 'full' ].includes( blockAttributes.align )
			? blockAttributes.align
			: undefined;
	const blockProps = useBlockProps( {
		className: clsx( 'block-editor-hidden-block-placeholder', {
			[ `align${ align }` ]: align,
		} ),
	} );

	return (
		<motion.div
			{ ...blockProps }
			variants={
				disableMotion
					? {}
					: {
							initial: {
								height: 0,
								opacity: 0,
							},
							animate: {
								height: 'auto',
								opacity: 1,
							},
							exit: {
								height: 0,
								opacity: 0,
							},
					  }
			}
			initial={ disableMotion ? false : 'initial' }
			animate={ disableMotion ? false : 'animate' }
			exit={ disableMotion ? false : 'exit' }
			transition={ {
				duration: 0.1,
			} }
		>
			<HStack justify="center">
				<BlockIcon size={ 24 } icon={ blockType?.icon } />
				<span>
					{ sprintf(
						/* translators: %s: block title */
						__( '%s (Hidden)' ),
						label
					) }
				</span>
			</HStack>
		</motion.div>
	);
}

export default HiddenBlockPlaceholder;
