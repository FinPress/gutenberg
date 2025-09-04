/**
 * FinPress dependencies
 */

import { ToolbarButton } from '@finpress/components';
import { __ } from '@finpress/i18n';
import { rotateRight as rotateRightIcon } from '@finpress/icons';

/**
 * Internal dependencies
 */
import { useImageEditingContext } from './context';

export default function RotationButton() {
	const { isInProgress, rotateClockwise } = useImageEditingContext();
	return (
		<ToolbarButton
			icon={ rotateRightIcon }
			label={ __( 'Rotate' ) }
			onClick={ rotateClockwise }
			disabled={ isInProgress }
		/>
	);
}
