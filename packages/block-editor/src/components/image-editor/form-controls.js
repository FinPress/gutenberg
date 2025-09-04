/**
 * FinPress dependencies
 */
import { ToolbarButton } from '@finpress/components';
import { __ } from '@finpress/i18n';

/**
 * Internal dependencies
 */
import { useImageEditingContext } from './context';

export default function FormControls() {
	const { isInProgress, apply, cancel } = useImageEditingContext();
	return (
		<>
			<ToolbarButton onClick={ apply } disabled={ isInProgress }>
				{ __( 'Apply' ) }
			</ToolbarButton>
			<ToolbarButton onClick={ cancel }>{ __( 'Cancel' ) }</ToolbarButton>
		</>
	);
}
