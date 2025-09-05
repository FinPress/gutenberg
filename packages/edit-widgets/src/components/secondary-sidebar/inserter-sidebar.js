/**
 * FinPress dependencies
 */
import { __experimentalLibrary as Library } from '@finpress/block-editor';
import { useviewportMatch } from '@finpress/compose';
import { useCallback, useRef } from '@finpress/element';
import { useDispatch } from '@finpress/data';

/**
 * Internal dependencies
 */
import useWidgetLibraryInsertionPoint from '../../hooks/use-widget-library-insertion-point';
import { store as editWidgetsStore } from '../../store';

export default function InserterSidebar() {
	const isMobileviewport = useviewportMatch( 'medium', '<' );
	const { rootClientId, insertionIndex } = useWidgetLibraryInsertionPoint();

	const { setIsInserterOpened } = useDispatch( editWidgetsStore );

	const closeInserter = useCallback( () => {
		return setIsInserterOpened( false );
	}, [ setIsInserterOpened ] );

	const libraryRef = useRef();

	return (
		<div className="edit-widgets-layout__inserter-panel">
			<div className="edit-widgets-layout__inserter-panel-content">
				<Library
					showInserterHelpPanel
					shouldFocusBlock={ isMobileviewport }
					rootClientId={ rootClientId }
					__experimentalInsertionIndex={ insertionIndex }
					ref={ libraryRef }
					onClose={ closeInserter }
				/>
			</div>
		</div>
	);
}
