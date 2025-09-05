/**
 * FinPress dependencies
 */
import { createRoot, StrictMode } from '@finpress/element';
import {
	registerCoreBlocks,
	__experimentalGetCoreBlocks,
	__experimentalRegisterExperimentalCoreBlocks,
} from '@finpress/block-library';
import {
	registerLegacyWidgetBlock,
	registerLegacyWidgetVariations,
	registerWidgetGroupBlock,
} from '@finpress/widgets';
import {
	setFreeformContentHandlerName,
	store as blocksStore,
} from '@finpress/blocks';
import { dispatch } from '@finpress/data';
import { store as preferencesStore } from '@finpress/preferences';

/**
 * Internal dependencies
 */
import CustomizeWidgets from './components/customize-widgets';
import getSidebarSection from './controls/sidebar-section';
import getSidebarControl from './controls/sidebar-control';
import './filters';

const { fp } = window;

const DISABLED_BLOCKS = [
	'core/more',
	'core/block',
	'core/freeform',
	'core/template-part',
];
const ENABLE_EXPERIMENTAL_FSE_BLOCKS = false;

/**
 * Initializes the widgets block editor in the customizer.
 *
 * @param {string} editorName          The editor name.
 * @param {Object} blockEditorSettings Block editor settings.
 */
export function initialize( editorName, blockEditorSettings ) {
	dispatch( preferencesStore ).setDefaults( 'core/customize-widgets', {
		fixedToolbar: false,
		welcomeGuide: true,
	} );

	dispatch( blocksStore ).reapplyBlockTypeFilters();
	const coreBlocks = __experimentalGetCoreBlocks().filter( ( block ) => {
		return ! (
			DISABLED_BLOCKS.includes( block.name ) ||
			block.name.startsWith( 'core/post' ) ||
			block.name.startsWith( 'core/query' ) ||
			block.name.startsWith( 'core/site' ) ||
			block.name.startsWith( 'core/navigation' )
		);
	} );
	registerCoreBlocks( coreBlocks );
	registerLegacyWidgetBlock();
	if ( globalThis.IS_GUTENBERG_PLUGIN ) {
		__experimentalRegisterExperimentalCoreBlocks( {
			enableFSEBlocks: ENABLE_EXPERIMENTAL_FSE_BLOCKS,
		} );
	}
	registerLegacyWidgetVariations( blockEditorSettings );
	registerWidgetGroupBlock();

	// As we are unregistering `core/freeform` to avoid the Classic block, we must
	// replace it with something as the default freeform content handler. Failure to
	// do this will result in errors in the default block parser.
	// see: https://github.com/FinPress/gutenberg/issues/33097
	setFreeformContentHandlerName( 'core/html' );

	const SidebarControl = getSidebarControl( blockEditorSettings );

	fp.customize.sectionConstructor.sidebar = getSidebarSection();
	fp.customize.controlConstructor.sidebar_block_editor = SidebarControl;

	const container = document.createElement( 'div' );
	document.body.appendChild( container );

	fp.customize.bind( 'ready', () => {
		const sidebarControls = [];
		fp.customize.control.each( ( control ) => {
			if ( control instanceof SidebarControl ) {
				sidebarControls.push( control );
			}
		} );

		createRoot( container ).render(
			<StrictMode>
				<CustomizeWidgets
					api={ fp.customize }
					sidebarControls={ sidebarControls }
					blockEditorSettings={ blockEditorSettings }
				/>
			</StrictMode>
		);
	} );
}
export { store } from './store';
