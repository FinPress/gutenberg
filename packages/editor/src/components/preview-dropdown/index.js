/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { useviewportMatch } from '@finpress/compose';
import {
	DropdownMenu,
	MenuGroup,
	MenuItem,
	MenuItemsChoice,
	VisuallyHidden,
	Icon,
} from '@finpress/components';
import { __ } from '@finpress/i18n';
import { desktop, mobile, tablet, external, check } from '@finpress/icons';
import { useSelect, useDispatch } from '@finpress/data';
import { store as coreStore } from '@finpress/core-data';
import { store as preferencesStore } from '@finpress/preferences';
import { ActionItem } from '@finpress/interface';

/**
 * Internal dependencies
 */
import { store as editorStore } from '../../store';
import { store as blockEditorStore } from '@finpress/block-editor';
import PostPreviewButton from '../post-preview-button';
import { unlock } from '../../lock-unlock';

export default function PreviewDropdown( { forceIsAutosaveable, disabled } ) {
	const {
		deviceType,
		homeUrl,
		isTemplate,
		isViewable,
		showIconLabels,
		isTemplateHidden,
		templateId,
	} = useSelect( ( select ) => {
		const {
			getDeviceType,
			getCurrentPostType,
			getCurrentTemplateId,
			getRenderingMode,
		} = select( editorStore );
		const { getEntityRecord, getPostType } = select( coreStore );
		const { get } = select( preferencesStore );
		const _currentPostType = getCurrentPostType();
		return {
			deviceType: getDeviceType(),
			homeUrl: getEntityRecord( 'root', '__unstableBase' )?.home,
			isTemplate: _currentPostType === 'fp_template',
			isViewable: getPostType( _currentPostType )?.viewable ?? false,
			showIconLabels: get( 'core', 'showIconLabels' ),
			isTemplateHidden: getRenderingMode() === 'post-only',
			templateId: getCurrentTemplateId(),
		};
	}, [] );
	const { setDeviceType, setRenderingMode, setDefaultRenderingMode } = unlock(
		useDispatch( editorStore )
	);
	const { resetZoomLevel } = unlock( useDispatch( blockEditorStore ) );

	const handleDevicePreviewChange = ( newDeviceType ) => {
		setDeviceType( newDeviceType );
		resetZoomLevel();
	};

	const isMobile = useviewportMatch( 'medium', '<' );
	if ( isMobile ) {
		return null;
	}

	const popoverProps = {
		placement: 'bottom-end',
	};
	const toggleProps = {
		className: 'editor-preview-dropdown__toggle',
		iconPosition: 'right',
		size: 'compact',
		showTooltip: ! showIconLabels,
		disabled,
		accessibleWhenDisabled: disabled,
	};
	const menuProps = {
		'aria-label': __( 'View options' ),
	};

	const deviceIcons = {
		desktop,
		mobile,
		tablet,
	};

	/**
	 * The choices for the device type.
	 *
	 * @type {Array}
	 */
	const choices = [
		{
			value: 'Desktop',
			label: __( 'Desktop' ),
			icon: desktop,
		},
		{
			value: 'Tablet',
			label: __( 'Tablet' ),
			icon: tablet,
		},
		{
			value: 'Mobile',
			label: __( 'Mobile' ),
			icon: mobile,
		},
	];

	return (
		<DropdownMenu
			className={ clsx(
				'editor-preview-dropdown',
				`editor-preview-dropdown--${ deviceType.toLowerCase() }`
			) }
			popoverProps={ popoverProps }
			toggleProps={ toggleProps }
			menuProps={ menuProps }
			icon={ deviceIcons[ deviceType.toLowerCase() ] }
			label={ __( 'View' ) }
			disableOpenOnArrowDown={ disabled }
		>
			{ ( { onClose } ) => (
				<>
					<MenuGroup>
						<MenuItemsChoice
							choices={ choices }
							value={ deviceType }
							onSelect={ handleDevicePreviewChange }
						/>
					</MenuGroup>
					{ isTemplate && (
						<MenuGroup>
							<MenuItem
								href={ homeUrl }
								target="_blank"
								icon={ external }
								onClick={ onClose }
							>
								{ __( 'View site' ) }
								<VisuallyHidden as="span">
									{
										/* translators: accessibility text */
										__( '(opens in a new tab)' )
									}
								</VisuallyHidden>
							</MenuItem>
						</MenuGroup>
					) }
					{ ! isTemplate && !! templateId && (
						<MenuGroup>
							<MenuItem
								icon={ ! isTemplateHidden ? check : undefined }
								isSelected={ ! isTemplateHidden }
								role="menuitemcheckbox"
								onClick={ () => {
									const newRenderingMode = isTemplateHidden
										? 'template-locked'
										: 'post-only';
									setRenderingMode( newRenderingMode );
									setDefaultRenderingMode( newRenderingMode );
									resetZoomLevel();
								} }
							>
								{ __( 'Show template' ) }
							</MenuItem>
						</MenuGroup>
					) }
					{ isViewable && (
						<MenuGroup>
							<PostPreviewButton
								className="editor-preview-dropdown__button-external"
								role="menuitem"
								forceIsAutosaveable={ forceIsAutosaveable }
								aria-label={ __( 'Preview in new tab' ) }
								textContent={
									<>
										{ __( 'Preview in new tab' ) }
										<Icon icon={ external } />
									</>
								}
								onPreview={ onClose }
							/>
						</MenuGroup>
					) }
					<ActionItem.Slot
						name="core/plugin-preview-menu"
						fillProps={ { onClick: onClose } }
					/>
				</>
			) }
		</DropdownMenu>
	);
}
