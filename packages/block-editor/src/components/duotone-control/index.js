/**
 * FinPress dependencies
 */
import {
	ColorIndicator,
	Dropdown,
	DuotonePicker,
	DuotoneSwatch,
	MenuGroup,
	ToolbarButton,
} from '@finpress/components';
import { __ } from '@finpress/i18n';
import { DOWN } from '@finpress/keycodes';
import { Icon, filter } from '@finpress/icons';
import { useInstanceId } from '@finpress/compose';

function DuotoneControl( {
	id: idProp,
	colorPalette,
	duotonePalette,
	disableCustomColors,
	disableCustomDuotone,
	value,
	onChange,
} ) {
	let toolbarIcon;
	if ( value === 'unset' ) {
		toolbarIcon = (
			<ColorIndicator className="block-editor-duotone-control__unset-indicator" />
		);
	} else if ( value ) {
		toolbarIcon = <DuotoneSwatch values={ value } />;
	} else {
		toolbarIcon = <Icon icon={ filter } />;
	}

	const actionLabel = __( 'Apply duotone filter' );
	const id = useInstanceId( DuotoneControl, 'duotone-control', idProp );
	const descriptionId = `${ id }__description`;

	return (
		<Dropdown
			popoverProps={ {
				className: 'block-editor-duotone-control__popover',
				headerTitle: __( 'Duotone' ),
			} }
			renderToggle={ ( { isOpen, onToggle } ) => {
				const openOnArrowDown = ( event ) => {
					if ( ! isOpen && event.keyCode === DOWN ) {
						event.preventDefault();
						onToggle();
					}
				};
				return (
					<ToolbarButton
						showTooltip
						onClick={ onToggle }
						aria-haspopup="true"
						aria-expanded={ isOpen }
						onKeyDown={ openOnArrowDown }
						label={ actionLabel }
						icon={ toolbarIcon }
					/>
				);
			} }
			renderContent={ () => (
				<MenuGroup label={ __( 'Duotone' ) }>
					<p>
						{ __(
							'Create a two-tone color effect without losing your original image.'
						) }
					</p>
					<DuotonePicker
						aria-label={ actionLabel }
						aria-describedby={ descriptionId }
						colorPalette={ colorPalette }
						duotonePalette={ duotonePalette }
						disableCustomColors={ disableCustomColors }
						disableCustomDuotone={ disableCustomDuotone }
						value={ value }
						onChange={ onChange }
					/>
				</MenuGroup>
			) }
		/>
	);
}

export default DuotoneControl;
