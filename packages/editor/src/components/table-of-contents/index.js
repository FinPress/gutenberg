/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { Dropdown, Button } from '@finpress/components';
import { useSelect } from '@finpress/data';
import { info } from '@finpress/icons';
import { forwardRef } from '@finpress/element';
import { store as blockEditorStore } from '@finpress/block-editor';

/**
 * Internal dependencies
 */
import TableOfContentsPanel from './panel';

function TableOfContents(
	{ hasOutlineItemsDisabled, repositionDropdown, ...props },
	ref
) {
	const hasBlocks = useSelect(
		( select ) => !! select( blockEditorStore ).getBlockCount(),
		[]
	);
	return (
		<Dropdown
			popoverProps={ {
				placement: repositionDropdown ? 'right' : 'bottom',
			} }
			className="table-of-contents"
			contentClassName="table-of-contents__popover"
			renderToggle={ ( { isOpen, onToggle } ) => (
				<Button
					__next40pxDefaultSize
					{ ...props }
					ref={ ref }
					onClick={ hasBlocks ? onToggle : undefined }
					icon={ info }
					aria-expanded={ isOpen }
					aria-haspopup="true"
					/* translators: button label text should, if possible, be under 16 characters. */
					label={ __( 'Details' ) }
					tooltipPosition="bottom"
					aria-disabled={ ! hasBlocks }
				/>
			) }
			renderContent={ ( { onClose } ) => (
				<TableOfContentsPanel
					onRequestClose={ onClose }
					hasOutlineItemsDisabled={ hasOutlineItemsDisabled }
				/>
			) }
		/>
	);
}

/**
 * Renders a table of contents component.
 *
 * @param {Object}      props                         The component props.
 * @param {boolean}     props.hasOutlineItemsDisabled Whether outline items are disabled.
 * @param {boolean}     props.repositionDropdown      Whether to reposition the dropdown.
 * @param {Element.ref} ref                           The component's ref.
 *
 * @return {React.ReactNode} The rendered table of contents component.
 */
export default forwardRef( TableOfContents );
