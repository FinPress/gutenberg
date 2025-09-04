/**
 * FinPress dependencies
 */
import { useDispatch, useSelect } from '@finpress/data';
import { store as editorStore } from '@finpress/editor';
import { privateApis as preferencesPrivateApis } from '@finpress/preferences';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';

const { PreferenceBaseOption } = unlock( preferencesPrivateApis );

export default function EnablePanelOption( props ) {
	const { toggleEditorPanelEnabled } = useDispatch( editorStore );
	const { isChecked, isRemoved } = useSelect(
		( select ) => {
			const { isEditorPanelEnabled, isEditorPanelRemoved } =
				select( editorStore );
			return {
				isChecked: isEditorPanelEnabled( props.panelName ),
				isRemoved: isEditorPanelRemoved( props.panelName ),
			};
		},
		[ props.panelName ]
	);

	if ( isRemoved ) {
		return null;
	}

	return (
		<PreferenceBaseOption
			isChecked={ isChecked }
			onChange={ () => toggleEditorPanelEnabled( props.panelName ) }
			{ ...props }
		/>
	);
}
