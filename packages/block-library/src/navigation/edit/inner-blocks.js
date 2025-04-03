/**
 * WordPress dependencies
 */
import { useEntityBlockEditor, store as coreStore } from '@wordpress/core-data';
import {
	useInnerBlocksProps,
	InnerBlocks,
	store as blockEditorStore,
	useBlockEditingMode,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import PlaceholderPreview from './placeholder/placeholder-preview';
import { DEFAULT_BLOCK, PRIORITIZED_INSERTER_BLOCKS } from '../constants';

function NonEditableNavigationInnerBlocks( {
	hasCustomPlaceholder,
	orientation,
	templateLock,
} ) {
	useBlockEditingMode( 'disabled' );

	const [ blocks ] = useEntityBlockEditor( 'postType', 'wp_navigation' );

	const showPlaceholder = ! hasCustomPlaceholder && ! blocks?.length;
	const placeholder = useMemo( () => <PlaceholderPreview />, [] );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'wp-block-navigation__container',
		},
		{
			value: blocks,
			onInput: () => {},
			onChange: () => {},
			orientation,
			templateLock,
			renderAppender: false,
			placeholder: showPlaceholder ? placeholder : undefined,
			__experimentalCaptureToolbars: true,
			__unstableDisableLayoutClassNames: true,
		}
	);

	return <div { ...innerBlocksProps } />;
}

function EditableNavigationInnerBlocks( {
	clientId,
	hasCustomPlaceholder,
	orientation,
	templateLock,
} ) {
	const {
		isImmediateParentOfSelectedBlock,
		selectedBlockHasChildren,
		isSelected,
	} = useSelect(
		( select ) => {
			const {
				getBlockCount,
				hasSelectedInnerBlock,
				getSelectedBlockClientId,
			} = select( blockEditorStore );
			const selectedBlockId = getSelectedBlockClientId();

			return {
				isImmediateParentOfSelectedBlock: hasSelectedInnerBlock(
					clientId,
					false
				),
				selectedBlockHasChildren: !! getBlockCount( selectedBlockId ),

				// This prop is already available but computing it here ensures it's
				// fresh compared to isImmediateParentOfSelectedBlock.
				isSelected: selectedBlockId === clientId,
			};
		},
		[ clientId ]
	);

	const [ blocks, onInput, onChange ] = useEntityBlockEditor(
		'postType',
		'wp_navigation'
	);

	// When the block is selected itself or has a top level item selected that
	// doesn't itself have children, show the standard appender. Else show no
	// appender.
	const parentOrChildHasSelection =
		isSelected ||
		( isImmediateParentOfSelectedBlock && ! selectedBlockHasChildren );

	const placeholder = useMemo( () => <PlaceholderPreview />, [] );

	const hasMenuItems = !! blocks?.length;

	// If there is a `ref` attribute pointing to a `wp_navigation` but
	// that menu has no **items** (i.e. empty) then show a placeholder.
	// The block must also be selected else the placeholder will display
	// alongside the appender.
	const showPlaceholder =
		! hasCustomPlaceholder && ! hasMenuItems && ! isSelected;

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'wp-block-navigation__container',
		},
		{
			value: blocks,
			onInput,
			onChange,
			prioritizedInserterBlocks: PRIORITIZED_INSERTER_BLOCKS,
			defaultBlock: DEFAULT_BLOCK,
			directInsert: true,
			orientation,
			templateLock,

			// As an exception to other blocks which feature nesting, show
			// the block appender even when a child block is selected.
			// This should be a temporary fix, to be replaced by improvements to
			// the sibling inserter.
			// See https://github.com/WordPress/gutenberg/issues/37572.
			renderAppender:
				isSelected ||
				( isImmediateParentOfSelectedBlock &&
					! selectedBlockHasChildren ) ||
				// Show the appender while dragging to allow inserting element between item and the appender.
				parentOrChildHasSelection
					? InnerBlocks.ButtonBlockAppender
					: false,
			placeholder: showPlaceholder ? placeholder : undefined,
			__experimentalCaptureToolbars: true,
			__unstableDisableLayoutClassNames: true,
		}
	);

	return <div { ...innerBlocksProps } />;
}

export default function NavigationInnerBlocks( {
	clientId,
	hasCustomPlaceholder,
	orientation,
	templateLock,
	postId,
} ) {
	const { canViewNavigation, canEditNavigation } = useSelect(
		( select ) => {
			return {
				canViewNavigation: !! select( coreStore ).canUser( 'read', {
					kind: 'postType',
					name: 'wp_navigation',
					id: postId,
				} ),
				canEditNavigation: !! select( coreStore ).canUser( 'update', {
					kind: 'postType',
					name: 'wp_navigation',
					id: postId,
				} ),
			};
		},
		[ postId ]
	);

	if ( ! canViewNavigation ) {
		return null;
	}

	const NavigationInnerBlocksComponent = canEditNavigation
		? EditableNavigationInnerBlocks
		: NonEditableNavigationInnerBlocks;

	return (
		<NavigationInnerBlocksComponent
			clientId={ clientId }
			hasCustomPlaceholder={ hasCustomPlaceholder }
			orientation={ orientation }
			templateLock={ templateLock }
			postId={ postId }
		/>
	);
}
