/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { Fragment, useMemo } from '@wordpress/element';
import { PanelBody, TextControl } from '@wordpress/components';
import { cleanForSlug } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { TabFill, TabsListSlot } from './slotfill';

/**
 * Generates a slug from a tab's text label.
 *
 * @param {string} label    Tab label RichText value.
 * @param {number} tabIndex Tab index value.
 *
 * @return {string} The generated slug with HTML stripped out.
 */
function slugFromLabel( label, tabIndex ) {
	// Get just the text content, filtering out any HTML tags from the RichText value.
	const htmlDocument = new window.DOMParser().parseFromString(
		label,
		'text/html'
	);
	if ( htmlDocument.body?.textContent ) {
		return cleanForSlug( htmlDocument.body.textContent );
	}

	// Fall back to using the tab index if the label is empty.
	return `tab-panel-${ tabIndex }`;
}

export default function Edit( {
	attributes,
	clientId,
	isSelected,
	setAttributes,
} ) {
	const { anchor, label, slug } = attributes;
	const { selectBlock } = useDispatch( blockEditorStore );

	const {
		blockIndex,
		hasChildBlocks,
		hasInnerBlocksSelected,
		tabsHasSelectedBlock,
		tabsClientId,
		forceDisplay,
		isFirstTab,
		isTabsClientSelected,
		previousTabClientId,
		nextTabClientId,
	} = useSelect(
		( select ) => {
			const rootClientId =
				select( blockEditorStore ).getBlockRootClientId( clientId );
			const _isFirstTab =
				select( blockEditorStore ).getBlockIndex( clientId ) === 0;
			const _isTabsClientSelected =
				select( blockEditorStore ).isBlockSelected( rootClientId );
			// Check if any of the rootClientId blocks are selected...
			const hasTabSelected = select(
				blockEditorStore
			).hasSelectedInnerBlock( rootClientId, true );

			return {
				blockIndex:
					select( blockEditorStore ).getBlockIndex( clientId ),
				hasChildBlocks:
					select( blockEditorStore ).getBlockOrder( clientId )
						.length > 0,
				hasInnerBlocksSelected: select(
					blockEditorStore
				).hasSelectedInnerBlock( clientId, true ),
				tabsClientId: rootClientId,
				forceDisplay: _isFirstTab && _isTabsClientSelected,
				tabsHasSelectedBlock: hasTabSelected,
				isFirstTab: _isFirstTab,
				isTabsClientSelected: _isTabsClientSelected,
				previousTabClientId:
					select( blockEditorStore ).getPreviousBlockClientId(
						clientId
					),
				nextTabClientId:
					select( blockEditorStore ).getNextBlockClientId( clientId ),
			};
		},
		[ clientId ]
	);

	/**
	 * This hook determines if the current tab is selected. This is true if it is the active tab, or if it is selected directly.
	 */
	const isSelectedTab = useMemo( () => {
		if ( isSelected || hasInnerBlocksSelected || forceDisplay ) {
			return true;
		}
		if (
			isFirstTab &&
			! isTabsClientSelected &&
			! isSelected &&
			! tabsHasSelectedBlock
		) {
			return true;
		}
		return false;
	}, [
		isSelected,
		hasInnerBlocksSelected,
		forceDisplay,
		isFirstTab,
		isTabsClientSelected,
		tabsHasSelectedBlock,
	] );

	// Use a custom anchor, if set. Otherwise fall back to the slug generated from the label text.
	const tabPanelId = useMemo( () => anchor || slug, [ anchor, slug ] );
	const tabLabelId = useMemo( () => `${ tabPanelId }--tab`, [ tabPanelId ] );

	const blockProps = useBlockProps( {
		hidden: ! isSelectedTab,
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			'aria-labelledby': tabLabelId,
			id: tabPanelId,
			role: 'tabpanel',
		},
		{
			renderAppender: hasChildBlocks
				? undefined
				: InnerBlocks.ButtonBlockAppender,
		}
	);

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title="Tab Settings">
					<TextControl
						label="Label"
						value={ label }
						onChange={ ( value ) =>
							setAttributes( { label: value } )
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<TabFill tabsClientId={ tabsClientId }>
					<li role="presentation" className="tabs__list-item">
						<a // eslint-disable-line jsx-a11y/anchor-is-valid -- remove href attribute in editor so inner text can be selected for editing
							aria-controls={ tabPanelId }
							aria-selected={ isSelectedTab }
							className="tabs__tab-label"
							id={ tabLabelId }
							onKeyDown={ ( event ) => {
								// Playing around with keyboard navigation. Will settle on the best approach next.
								switch ( event.key ) {
									case 'ArrowLeft':
									case 'ArrowUp':
										event.preventDefault();
										selectBlock( previousTabClientId );
										break;
									case 'ArrowRight':
									case 'ArrowDown':
										event.preventDefault();
										selectBlock( nextTabClientId );
										break;
								}
							} }
							role="tab"
							tabIndex="0"
						>
							<RichText
								tagName="span"
								withoutInteractiveFormatting
								value={ label }
								placeholder={ __( 'Add label…' ) }
								onChange={ ( value ) =>
									setAttributes( {
										label: value,
										slug: slugFromLabel(
											label,
											blockIndex
										),
									} )
								}
							/>
						</a>
					</li>
				</TabFill>

				{ isSelectedTab && (
					<Fragment>
						<TabsListSlot tabsClientId={ tabsClientId } />
						<section { ...innerBlocksProps } />
					</Fragment>
				) }
			</div>
		</Fragment>
	);
}
