/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { __unstableBlockToolbarLastItem as BlockToolbarLastItem } from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';

// Target blocks that should have the View button
const SUPPORTED_BLOCKS = [ 'core/navigation-link', 'core/navigation-submenu' ];

/**
 * Component that renders the View button for navigation blocks
 *
 * @param {Object} props            Component props.
 * @param {Object} props.attributes Block attributes.
 */
function NavigationViewButton( { attributes } ) {
	const { kind, id, type } = attributes;

	const onViewPage = useCallback( () => {
		if ( kind === 'post-type' && id && type ) {
			// Navigate to the post in edit mode
			const url = `/wp-admin/post.php?post=${ id }&action=edit`;
			window.open( url, '_blank' );
		}
	}, [ kind, id, type ] );

	// Only show for page-type links
	if ( kind !== 'post-type' || ! id || ! type ) {
		return null;
	}

	return (
		<BlockToolbarLastItem>
			<ToolbarGroup>
				<ToolbarButton
					name="view"
					title={ __( 'View' ) }
					onClick={ onViewPage }
				>
					{ __( 'View' ) }
				</ToolbarButton>
			</ToolbarGroup>
		</BlockToolbarLastItem>
	);
}

/**
 * Higher-order component that adds the View button to navigation blocks
 */
const withNavigationViewButton = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const isSupportedBlock = SUPPORTED_BLOCKS.includes( props.name );

		return (
			<>
				<BlockEdit key="edit" { ...props } />
				{ isSupportedBlock && <NavigationViewButton { ...props } /> }
			</>
		);
	},
	'withNavigationViewButton'
);

// Register the filter
addFilter(
	'editor.BlockEdit',
	'core/editor/with-navigation-view-button',
	withNavigationViewButton
);
