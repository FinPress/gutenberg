/**
 * FinPress dependencies
 */
import { BlockToolbar } from '@finpress/block-editor';
import { useSelect } from '@finpress/data';
import { useRef } from '@finpress/element';
import { __ } from '@finpress/i18n';
import { Popover, VisuallyHidden } from '@finpress/components';
import { PinnedItems } from '@finpress/interface';
import { useviewportMatch } from '@finpress/compose';
import { store as preferencesStore } from '@finpress/preferences';

/**
 * Internal dependencies
 */
import DocumentTools from './document-tools';
import SaveButton from '../save-button';
import MoreMenu from '../more-menu';

function Header() {
	const isLargeviewport = useviewportMatch( 'medium' );
	const blockToolbarRef = useRef();
	const { hasFixedToolbar } = useSelect(
		( select ) => ( {
			hasFixedToolbar: !! select( preferencesStore ).get(
				'core/edit-widgets',
				'fixedToolbar'
			),
		} ),
		[]
	);

	return (
		<>
			<div className="edit-widgets-header">
				<div className="edit-widgets-header__navigable-toolbar-wrapper">
					{ isLargeviewport && (
						<h1 className="edit-widgets-header__title">
							{ __( 'Widgets' ) }
						</h1>
					) }
					{ ! isLargeviewport && (
						<VisuallyHidden
							as="h1"
							className="edit-widgets-header__title"
						>
							{ __( 'Widgets' ) }
						</VisuallyHidden>
					) }
					<DocumentTools />
					{ hasFixedToolbar && isLargeviewport && (
						<>
							<div className="selected-block-tools-wrapper">
								<BlockToolbar hideDragHandle />
							</div>
							<Popover.Slot
								ref={ blockToolbarRef }
								name="block-toolbar"
							/>
						</>
					) }
				</div>
				<div className="edit-widgets-header__actions">
					<PinnedItems.Slot scope="core/edit-widgets" />
					<SaveButton />
					<MoreMenu />
				</div>
			</div>
		</>
	);
}

export default Header;
