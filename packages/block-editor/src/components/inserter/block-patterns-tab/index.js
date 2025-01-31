/**
 * WordPress dependencies
 */
import { useViewportMatch } from '@wordpress/compose';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as interfaceStore } from '@wordpress/interface';

/**
 * Internal dependencies
 */
import PatternsExplorerModal from '../block-patterns-explorer';
import MobileTabNavigation from '../mobile-tab-navigation';
import { PatternCategoryPreviews } from './pattern-category-previews';
import { usePatternCategories } from './use-pattern-categories';
import CategoryTabs from '../category-tabs';
import InserterNoResults from '../no-results';

export const PATTERNS_MODAL_NAME = 'block-editor/block-patterns-explorer';

function BlockPatternsTab( {
	onSelectCategory,
	selectedCategory,
	onInsert,
	rootClientId,
	children,
} ) {
	const isModalActive = useSelect( ( select ) =>
		select( interfaceStore ).isModalActive( PATTERNS_MODAL_NAME )
	);
	const { openModal, closeModal } = useDispatch( interfaceStore );

	const categories = usePatternCategories( rootClientId );

	const isMobile = useViewportMatch( 'medium', '<' );

	if ( ! categories.length ) {
		return <InserterNoResults />;
	}

	return (
		<>
			{ ! isMobile && (
				<div className="block-editor-inserter__block-patterns-tabs-container">
					<CategoryTabs
						categories={ categories }
						selectedCategory={ selectedCategory }
						onSelectCategory={ onSelectCategory }
					>
						{ children }
					</CategoryTabs>
					<Button
						__next40pxDefaultSize
						className="block-editor-inserter__patterns-explore-button"
						onClick={ () => openModal( PATTERNS_MODAL_NAME ) }
						variant="secondary"
					>
						{ __( 'Explore all patterns' ) }
					</Button>
				</div>
			) }
			{ isMobile && (
				<MobileTabNavigation categories={ categories }>
					{ ( category ) => (
						<div className="block-editor-inserter__category-panel">
							<PatternCategoryPreviews
								key={ category.name }
								onInsert={ onInsert }
								rootClientId={ rootClientId }
								category={ category }
							/>
						</div>
					) }
				</MobileTabNavigation>
			) }
			{ isModalActive && (
				<PatternsExplorerModal
					initialCategory={ selectedCategory || categories[ 0 ] }
					patternCategories={ categories }
					onModalClose={ closeModal }
					rootClientId={ rootClientId }
				/>
			) }
		</>
	);
}

export default BlockPatternsTab;
