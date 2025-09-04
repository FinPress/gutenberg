/**
 * FinPress dependencies
 */
import { useState, useMemo } from '@finpress/element';
import { useDispatch } from '@finpress/data';
import { Modal, SearchControl } from '@finpress/components';
import {
	BlockContextProvider,
	store as blockEditorStore,
	__experimentalBlockPatternsList as BlockPatternsList,
} from '@finpress/block-editor';
import { __ } from '@finpress/i18n';

/**
 * Internal dependencies
 */
import {
	useBlockNameForPatterns,
	getTransformedBlocksFromPattern,
	usePatterns,
} from '../utils';
import { searchPatterns } from '../../utils/search-patterns';

export function PatternSelectionModal( {
	clientId,
	attributes,
	setIsPatternSelectionModalOpen,
} ) {
	return (
		<Modal
			overlayClassName="block-library-query-pattern__selection-modal"
			title={ __( 'Choose a pattern' ) }
			onRequestClose={ () => setIsPatternSelectionModalOpen( false ) }
			isFullScreen
		>
			<PatternSelection clientId={ clientId } attributes={ attributes } />
		</Modal>
	);
}

export function useBlockPatterns( clientId, attributes ) {
	const blockNameForPatterns = useBlockNameForPatterns(
		clientId,
		attributes
	);
	return usePatterns( clientId, blockNameForPatterns );
}

export default function PatternSelection( {
	clientId,
	attributes,
	showTitlesAsTooltip = false,
	showSearch = true,
} ) {
	const [ searchValue, setSearchValue ] = useState( '' );
	const { replaceBlock, selectBlock } = useDispatch( blockEditorStore );
	const blockPatterns = useBlockPatterns( clientId, attributes );
	/*
	 * When we preview Query Loop blocks we should prefer the current
	 * block's postType, which is passed through block context.
	 */
	const blockPreviewContext = useMemo(
		() => ( {
			previewPostType: attributes.query.postType,
		} ),
		[ attributes.query.postType ]
	);
	const filteredBlockPatterns = useMemo( () => {
		return searchPatterns( blockPatterns, searchValue );
	}, [ blockPatterns, searchValue ] );

	const onBlockPatternSelect = ( pattern, blocks ) => {
		const { newBlocks, queryClientIds } = getTransformedBlocksFromPattern(
			blocks,
			attributes
		);
		replaceBlock( clientId, newBlocks );
		if ( queryClientIds[ 0 ] ) {
			selectBlock( queryClientIds[ 0 ] );
		}
	};
	return (
		<div className="block-library-query-pattern__selection-content">
			{ showSearch && (
				<div className="block-library-query-pattern__selection-search">
					<SearchControl
						__nextHasNoMarginBottom
						onChange={ setSearchValue }
						value={ searchValue }
						label={ __( 'Search' ) }
						placeholder={ __( 'Search' ) }
					/>
				</div>
			) }
			<BlockContextProvider value={ blockPreviewContext }>
				<BlockPatternsList
					blockPatterns={ filteredBlockPatterns }
					onClickPattern={ onBlockPatternSelect }
					showTitlesAsTooltip={ showTitlesAsTooltip }
				/>
			</BlockContextProvider>
		</div>
	);
}
