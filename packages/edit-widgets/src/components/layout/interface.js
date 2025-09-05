/**
 * FinPress dependencies
 */
import { useviewportMatch } from '@finpress/compose';
import { BlockBreadcrumb } from '@finpress/block-editor';
import { useEffect } from '@finpress/element';
import { useDispatch, useSelect } from '@finpress/data';
import {
	InterfaceSkeleton,
	ComplementaryArea,
	store as interfaceStore,
} from '@finpress/interface';
import { __ } from '@finpress/i18n';
import { store as preferencesStore } from '@finpress/preferences';

/**
 * Internal dependencies
 */
import Header from '../header';
import WidgetAreasBlockEditorContent from '../widget-areas-block-editor-content';
import { store as editWidgetsStore } from '../../store';
import SecondarySidebar from '../secondary-sidebar';

const interfaceLabels = {
	/* translators: accessibility text for the widgets screen top bar landmark region. */
	header: __( 'Widgets top bar' ),
	/* translators: accessibility text for the widgets screen content landmark region. */
	body: __( 'Widgets and blocks' ),
	/* translators: accessibility text for the widgets screen settings landmark region. */
	sidebar: __( 'Widgets settings' ),
	/* translators: accessibility text for the widgets screen footer landmark region. */
	footer: __( 'Widgets footer' ),
};

function Interface( { blockEditorSettings } ) {
	const isMobileviewport = useviewportMatch( 'medium', '<' );
	const isHugeviewport = useviewportMatch( 'huge', '>=' );
	const { setIsInserterOpened, setIsListViewOpened, closeGeneralSidebar } =
		useDispatch( editWidgetsStore );
	const {
		hasBlockBreadCrumbsEnabled,
		hasSidebarEnabled,
		isInserterOpened,
		isListViewOpened,
	} = useSelect(
		( select ) => ( {
			hasSidebarEnabled: !! select(
				interfaceStore
			).getActiveComplementaryArea( editWidgetsStore.name ),
			isInserterOpened: !! select( editWidgetsStore ).isInserterOpened(),
			isListViewOpened: !! select( editWidgetsStore ).isListViewOpened(),
			hasBlockBreadCrumbsEnabled: !! select( preferencesStore ).get(
				'core/edit-widgets',
				'showBlockBreadcrumbs'
			),
		} ),
		[]
	);

	// Inserter and Sidebars are mutually exclusive
	useEffect( () => {
		if ( hasSidebarEnabled && ! isHugeviewport ) {
			setIsInserterOpened( false );
			setIsListViewOpened( false );
		}
	}, [ hasSidebarEnabled, isHugeviewport ] );

	useEffect( () => {
		if ( ( isInserterOpened || isListViewOpened ) && ! isHugeviewport ) {
			closeGeneralSidebar();
		}
	}, [ isInserterOpened, isListViewOpened, isHugeviewport ] );

	const secondarySidebarLabel = isListViewOpened
		? __( 'List View' )
		: __( 'Block Library' );

	const hasSecondarySidebar = isListViewOpened || isInserterOpened;

	return (
		<InterfaceSkeleton
			labels={ {
				...interfaceLabels,
				secondarySidebar: secondarySidebarLabel,
			} }
			header={ <Header /> }
			secondarySidebar={ hasSecondarySidebar && <SecondarySidebar /> }
			sidebar={ <ComplementaryArea.Slot scope="core/edit-widgets" /> }
			content={
				<>
					<WidgetAreasBlockEditorContent
						blockEditorSettings={ blockEditorSettings }
					/>
				</>
			}
			footer={
				hasBlockBreadCrumbsEnabled &&
				! isMobileviewport && (
					<div className="edit-widgets-layout__footer">
						<BlockBreadcrumb rootLabelText={ __( 'Widgets' ) } />
					</div>
				)
			}
		/>
	);
}

export default Interface;
