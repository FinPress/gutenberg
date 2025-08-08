/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import QueryContent from './query-content';
import QueryPlaceholder from './query-placeholder';
import { PatternSelectionModal } from './pattern-selection';

/*
 * QueryEdit - The edit component for the Query block in the WordPress block editor.
 *
 * @param {Object} props                    The component properties.
 * @param {string} props.clientId           The unique client ID of the Query block.
 * @param {Object} props.attributes         The attributes of the Query block.
 *
 * @returns {JSX.Element} 					The rendered Query block edit interface.
 */
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
