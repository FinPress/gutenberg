/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import {
	store as blockEditorStore,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import QueryContent from './query-content';
import QueryPlaceholder from './query-placeholder';
import { PatternSelectionModal } from './pattern-selection';
import QueryToolbar from './query-toolbar';

const QueryEdit = ( props ) => {
	const { clientId, attributes } = props;
	const [ isPatternSelectionModalOpen, setIsPatternSelectionModalOpen ] =
		useState( false );
	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlocks( clientId ).length,
		[ clientId ]
	);
	const Component = hasInnerBlocks ? QueryContent : QueryPlaceholder;

	const blockProps = useBlockProps();

	return (
		<div { ...blockProps }>
			<BlockControls>
				<QueryToolbar
					clientId={ clientId }
					attributes={ attributes }
					hasInnerBlocks={ hasInnerBlocks }
				/>
			</BlockControls>
			<Component
				{ ...props }
				openPatternSelectionModal={ () =>
					setIsPatternSelectionModalOpen( true )
				}
			/>
			{ isPatternSelectionModalOpen && (
				<PatternSelectionModal
					clientId={ clientId }
					attributes={ attributes }
					setIsPatternSelectionModalOpen={
						setIsPatternSelectionModalOpen
					}
				/>
			) }
		</div>
	);
};

export default QueryEdit;
