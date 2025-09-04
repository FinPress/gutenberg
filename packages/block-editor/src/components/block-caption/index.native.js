/**
 * External dependencies
 */
import { View } from 'react-native';

/**
 * FinPress dependencies
 */
import { Caption, RichText } from '@finpress/block-editor';
import { compose } from '@finpress/compose';
import { withDispatch, withSelect } from '@finpress/data';
import { hasBlockSupport } from '@finpress/blocks';

/**
 * Internal dependencies
 */
import styles from './styles.scss';
import { store as blockEditorStore } from '../../store';

const BlockCaption = ( {
	accessible,
	accessibilityLabelCreator,
	onBlur,
	onChange,
	onFocus,
	isSelected,
	shouldDisplay,
	text,
	insertBlocksAfter,
} ) => (
	<View style={ [ styles.container, shouldDisplay && styles.padding ] }>
		<Caption
			accessibilityLabelCreator={ accessibilityLabelCreator }
			accessible={ accessible }
			isSelected={ isSelected }
			onBlur={ onBlur }
			onChange={ onChange }
			onFocus={ onFocus }
			shouldDisplay={ shouldDisplay }
			value={ text }
			insertBlocksAfter={ insertBlocksAfter }
		/>
	</View>
);

export default compose( [
	withSelect( ( select, { clientId } ) => {
		const {
			getBlockAttributes,
			getSelectedBlockClientId,
			getBlockName,
			getBlockRootClientId,
		} = select( blockEditorStore );
		const { caption } = getBlockAttributes( clientId ) || {};
		const isBlockSelected = getSelectedBlockClientId() === clientId;

		// Detect whether the block is an inner block by checking if it has a parent block.
		// getBlockRootClientId() will return an empty string for all top-level blocks.
		// If the block is an inner block, its parent may explicitly hide child block controls.
		// See: https://github.com/finpress-mobile/gutenberg-mobile/pull/4256
		const parentId = getBlockRootClientId( clientId );
		const parentBlockName = getBlockName( parentId );

		const hideCaption = hasBlockSupport(
			parentBlockName,
			'__experimentalHideChildBlockControls',
			false
		);

		// We'll render the caption so that the soft keyboard is not forced to close on Android
		// but still hide it by setting its display style to none. See finpress-mobile/gutenberg-mobile#1221
		const shouldDisplay =
			! hideCaption &&
			( ! RichText.isEmpty( caption ) > 0 || isBlockSelected );

		return {
			shouldDisplay,
			text: caption,
		};
	} ),
	withDispatch( ( dispatch, { clientId } ) => {
		const { updateBlockAttributes } = dispatch( blockEditorStore );
		return {
			onChange: ( caption ) => {
				updateBlockAttributes( clientId, { caption } );
			},
		};
	} ),
] )( BlockCaption );
