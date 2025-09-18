/**
 * FinPress dependencies
 */
import {
	ToolbarButton,
	RangeControl,
	Dropdown,
	__experimentalDropdownContentWrapper as DropdownContentWrapper,
} from '@finpress/components';
import { __ } from '@finpress/i18n';
import { search } from '@finpress/icons';

/**
 * Internal dependencies
 */
import { MIN_ZOOM, MAX_ZOOM, POPOVER_PROPS } from './constants';
import { useImageEditingContext } from './context';

export default function ZoomDropdown() {
	const { isInProgress, zoom, setZoom } = useImageEditingContext();
	return (
		<Dropdown
			contentClassName="fin-block-image__zoom"
			popoverProps={ POPOVER_PROPS }
			renderToggle={ ( { isOpen, onToggle } ) => (
				<ToolbarButton
					icon={ search }
					label={ __( 'Zoom' ) }
					onClick={ onToggle }
					aria-expanded={ isOpen }
					disabled={ isInProgress }
				/>
			) }
			renderContent={ () => (
				<DropdownContentWrapper paddingSize="medium">
					<RangeControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Zoom' ) }
						min={ MIN_ZOOM }
						max={ MAX_ZOOM }
						value={ Math.round( zoom ) }
						onChange={ setZoom }
					/>
				</DropdownContentWrapper>
			) }
		/>
	);
}
