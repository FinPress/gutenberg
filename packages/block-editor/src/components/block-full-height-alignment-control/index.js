/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { ToolbarButton } from '@finpress/components';
import { fullscreen } from '@finpress/icons';

function BlockFullHeightAlignmentControl( {
	isActive,
	label = __( 'Full height' ),
	onToggle,
	isDisabled,
} ) {
	return (
		<ToolbarButton
			isActive={ isActive }
			icon={ fullscreen }
			label={ label }
			onClick={ () => onToggle( ! isActive ) }
			disabled={ isDisabled }
		/>
	);
}

export default BlockFullHeightAlignmentControl;
