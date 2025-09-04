/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { privateApis as blockEditorPrivateApis } from '@finpress/block-editor';

/**
 * Internal dependencies
 */
import DimensionsPanel from './dimensions-panel';
import ScreenHeader from './header';
import { unlock } from '../../lock-unlock';

const { useHasDimensionsPanel, useGlobalSetting, useSettingsForBlockElement } =
	unlock( blockEditorPrivateApis );

function ScreenLayout() {
	const [ rawSettings ] = useGlobalSetting( '' );
	const settings = useSettingsForBlockElement( rawSettings );
	const hasDimensionsPanel = useHasDimensionsPanel( settings );

	return (
		<>
			<ScreenHeader title={ __( 'Layout' ) } />
			{ hasDimensionsPanel && <DimensionsPanel /> }
		</>
	);
}

export default ScreenLayout;
