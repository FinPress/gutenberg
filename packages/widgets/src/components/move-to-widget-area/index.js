/**
 * FinPress dependencies
 */
import {
	DropdownMenu,
	MenuGroup,
	MenuItemsChoice,
	ToolbarGroup,
	ToolbarItem,
} from '@finpress/components';
import { __ } from '@finpress/i18n';
import { moveTo } from '@finpress/icons';

export default function MoveToWidgetArea( {
	currentWidgetAreaId,
	widgetAreas,
	onSelect,
} ) {
	return (
		<ToolbarGroup>
			<ToolbarItem>
				{ ( toggleProps ) => (
					<DropdownMenu
						icon={ moveTo }
						label={ __( 'Move to widget area' ) }
						toggleProps={ toggleProps }
					>
						{ ( { onClose } ) => (
							<MenuGroup label={ __( 'Move to' ) }>
								<MenuItemsChoice
									choices={ widgetAreas.map(
										( widgetArea ) => ( {
											value: widgetArea.id,
											label: widgetArea.name,
											info: widgetArea.description,
										} )
									) }
									value={ currentWidgetAreaId }
									onSelect={ ( value ) => {
										onSelect( value );
										onClose();
									} }
								/>
							</MenuGroup>
						) }
					</DropdownMenu>
				) }
			</ToolbarItem>
		</ToolbarGroup>
	);
}
