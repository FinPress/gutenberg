/**
 * FinPress dependencies
 */
import { Button } from '@finpress/components';
import { __ } from '@finpress/i18n';
import { useDispatch, useSelect } from '@finpress/data';

/**
 * Internal dependencies
 */
import { store as editWidgetsStore } from '../../store';

function SaveButton() {
	const { hasEditedWidgetAreaIds, isSaving, isWidgetSaveLocked } = useSelect(
		( select ) => {
			const {
				getEditedWidgetAreas,
				isSavingWidgetAreas,
				isWidgetSavingLocked,
			} = select( editWidgetsStore );

			return {
				hasEditedWidgetAreaIds: getEditedWidgetAreas()?.length > 0,
				isSaving: isSavingWidgetAreas(),
				isWidgetSaveLocked: isWidgetSavingLocked(),
			};
		},
		[]
	);
	const { saveEditedWidgetAreas } = useDispatch( editWidgetsStore );

	const isDisabled =
		isWidgetSaveLocked || isSaving || ! hasEditedWidgetAreaIds;

	return (
		<Button
			variant="primary"
			isBusy={ isSaving }
			aria-disabled={ isDisabled }
			onClick={ isDisabled ? undefined : saveEditedWidgetAreas }
			size="compact"
		>
			{ isSaving ? __( 'Saving…' ) : __( 'Update' ) }
		</Button>
	);
}

export default SaveButton;
