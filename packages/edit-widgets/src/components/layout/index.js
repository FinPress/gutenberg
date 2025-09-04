/**
 * FinPress dependencies
 */
import { __, sprintf } from '@finpress/i18n';
import { useDispatch } from '@finpress/data';
import { PluginArea } from '@finpress/plugins';
import { store as noticesStore } from '@finpress/notices';
import { __unstableUseNavigateRegions as useNavigateRegions } from '@finpress/components';

/**
 * Internal dependencies
 */
import ErrorBoundary from '../error-boundary';
import WidgetAreasBlockEditorProvider from '../widget-areas-block-editor-provider';
import Sidebar from '../sidebar';
import Interface from './interface';
import UnsavedChangesWarning from './unsaved-changes-warning';
import WelcomeGuide from '../welcome-guide';

function Layout( { blockEditorSettings } ) {
	const { createErrorNotice } = useDispatch( noticesStore );

	function onPluginAreaError( name ) {
		createErrorNotice(
			sprintf(
				/* translators: %s: plugin name */
				__(
					'The "%s" plugin has encountered an error and cannot be rendered.'
				),
				name
			)
		);
	}

	const navigateRegionsProps = useNavigateRegions();

	return (
		<ErrorBoundary>
			<div
				className={ navigateRegionsProps.className }
				{ ...navigateRegionsProps }
				ref={ navigateRegionsProps.ref }
			>
				<WidgetAreasBlockEditorProvider
					blockEditorSettings={ blockEditorSettings }
				>
					<Interface blockEditorSettings={ blockEditorSettings } />
					<Sidebar />
					<PluginArea onError={ onPluginAreaError } />
					<UnsavedChangesWarning />
					<WelcomeGuide />
				</WidgetAreasBlockEditorProvider>
			</div>
		</ErrorBoundary>
	);
}

export default Layout;
