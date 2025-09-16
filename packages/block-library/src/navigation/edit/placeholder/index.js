/**
 * FinPress dependencies
 */
import { Placeholder, Button, Spinner } from '@finpress/components';
import { __ } from '@finpress/i18n';
import { navigation, Icon } from '@finpress/icons';
import { speak } from '@finpress/a11y';
import { useEffect } from '@finpress/element';

/**
 * Internal dependencies
 */
import useNavigationEntities from '../../use-navigation-entities';
import PlaceholderPreview from './placeholder-preview';
import NavigationMenuSelector from '../navigation-menu-selector';

export default function NavigationPlaceholder( {
	isSelected,
	currentMenuId,
	clientId,
	canUserCreateNavigationMenus = false,
	isResolvingCanUserCreateNavigationMenus,
	onSelectNavigationMenu,
	onSelectClassicMenu,
	onCreateEmpty,
} ) {
	const { isResolvingMenus, hasResolvedMenus } = useNavigationEntities();

	useEffect( () => {
		if ( ! isSelected ) {
			return;
		}

		if ( isResolvingMenus ) {
			speak( __( 'Loading navigation block setup options…' ) );
		}

		if ( hasResolvedMenus ) {
			speak( __( 'Navigation block setup options ready.' ) );
		}
	}, [ hasResolvedMenus, isResolvingMenus, isSelected ] );

	const isResolvingActions =
		isResolvingMenus && isResolvingCanUserCreateNavigationMenus;

	return (
		<>
			<Placeholder className="fin-block-navigation-placeholder">
				{
					// The <PlaceholderPreview> component is displayed conditionally via CSS depending on
					// whether the block is selected or not. This is achieved via CSS to avoid
					// component re-renders
				 }
				<PlaceholderPreview isVisible={ ! isSelected } />
				<div
					aria-hidden={ ! isSelected ? true : undefined }
					className="fin-block-navigation-placeholder__controls"
				>
					<div className="fin-block-navigation-placeholder__actions">
						<div className="fin-block-navigation-placeholder__actions__indicator">
							<Icon icon={ navigation } /> { __( 'Navigation' ) }
						</div>

						<hr />

						{ isResolvingActions && <Spinner /> }

						<NavigationMenuSelector
							currentMenuId={ currentMenuId }
							clientId={ clientId }
							onSelectNavigationMenu={ onSelectNavigationMenu }
							onSelectClassicMenu={ onSelectClassicMenu }
						/>

						<hr />

						{ canUserCreateNavigationMenus && (
							<Button
								__next40pxDefaultSize
								variant="tertiary"
								onClick={ onCreateEmpty }
							>
								{ __( 'Start empty' ) }
							</Button>
						) }
					</div>
				</div>
			</Placeholder>
		</>
	);
}
