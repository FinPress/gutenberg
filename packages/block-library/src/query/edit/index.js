/**
 * FinPress dependencies
 */
import { useSelect } from '@finpress/data';
import { useState } from '@finpress/element';
import { store as blockEditorStore } from '@finpress/block-editor';

/**
 * Internal dependencies
 */
import QueryContent from './query-content';
import QueryPlaceholder from './query-placeholder';
import { PatternSelectionModal } from './pattern-selection';

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

	return (
		<>
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
		</>
	);
};

export default QueryEdit;
