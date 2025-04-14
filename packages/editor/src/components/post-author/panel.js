/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Dropdown } from '@wordpress/components';
import { useState, useMemo } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import PostAuthorCheck from './check';
import PostAuthorForm from './index';
import PostPanelRow from '../post-panel-row';
import { useAuthorsQuery } from './hook';
import PostPanelRowButton from '../post-panel-row-button';

function PostAuthorToggle( { isOpen, onClick } ) {
	const { postAuthor } = useAuthorsQuery();
	const authorName =
		decodeEntities( postAuthor?.name ) || __( '(No author)' );
	return (
		<PostPanelRowButton
			label={ __( 'Author' ) }
			displayedValue={ authorName }
			className="editor-post-author__panel-toggle"
			isExpanded={ isOpen }
			onClick={ onClick }
		/>
	);
}

/**
 * Renders the Post Author Panel component.
 *
 * @return {React.ReactNode} The rendered component.
 */
export function PostAuthor() {
	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [ popoverAnchor, setPopoverAnchor ] = useState( null );
	// Memoize popoverProps to avoid returning a new object every time.
	const popoverProps = useMemo(
		() => ( {
			// Anchor the popover to the middle of the entire row so that it doesn't
			// move around when the label changes.
			anchor: popoverAnchor,
			placement: 'left-start',
			offset: 36,
			shift: true,
		} ),
		[ popoverAnchor ]
	);
	return (
		<PostAuthorCheck>
			<PostPanelRow ref={ setPopoverAnchor }>
				<Dropdown
					popoverProps={ popoverProps }
					className="editor-post-author__panel-dropdown"
					contentClassName="editor-post-author__panel-dialog"
					focusOnMount
					renderToggle={ ( { isOpen, onToggle } ) => (
						<PostAuthorToggle
							isOpen={ isOpen }
							onClick={ onToggle }
						/>
					) }
					renderContent={ ( { onClose } ) => (
						<div className="editor-post-author">
							<InspectorPopoverHeader
								title={ __( 'Author' ) }
								onClose={ onClose }
							/>
							<PostAuthorForm onClose={ onClose } />
						</div>
					) }
				/>
			</PostPanelRow>
		</PostAuthorCheck>
	);
}

export default PostAuthor;
