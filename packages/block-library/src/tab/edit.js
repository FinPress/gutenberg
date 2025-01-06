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
import { Fragment, useEffect, useMemo } from '@wordpress/element';
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
	const { anchor, label, slug, tabIndex } = attributes;
	const { __unstableMarkNextChangeAsNotPersistent } =
		useDispatch( blockEditorStore );

	const { blockIndex, hasChildBlocks, hasInnerBlocksSelected, tabsClientId } =
		useSelect(
			( select ) => {
				const rootClientId =
					select( blockEditorStore ).getBlockRootClientId( clientId );
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
				};
			},
			[ clientId ]
		);

	/**
	 * This hook ensures the tabIndex attribute is kept in sync.
	 */
	useEffect( () => {
		if ( blockIndex !== tabIndex ) {
			__unstableMarkNextChangeAsNotPersistent();
			setAttributes( { tabIndex: blockIndex } );
		}
	}, [
		__unstableMarkNextChangeAsNotPersistent,
		blockIndex,
		setAttributes,
		tabIndex,
	] );

	/**
	 * This hook determines if the current tab is selected. This is true if it is the active tab, or if it is selected directly.
	 */
	const isSelectedTab = useMemo( () => {
		return isSelected || hasInnerBlocksSelected;
	}, [ isSelected, hasInnerBlocksSelected ] );

	// Use a custom anchor, if set. Otherwise fall back to the slug generated from the label text.
	const tabPanelId = useMemo( () => anchor || slug, [ anchor, slug ] );
	const tabLabelId = useMemo( () => `${ tabPanelId }--tab`, [ tabPanelId ] );

	const blockProps = useBlockProps();

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
							// onClick={ () => console.log( 'onClick', clientId ) }
							// onFocus={ () => console.log( 'onFocus', clientId ) }
							// onKeyDown={ ( event ) => {
							// 	if ( event.key === 'Enter' ) {
							// 		console.log( 'onEnter', clientId );
							// 	}
							// } }
							role="tab"
							tabIndex={ isSelectedTab ? 0 : -1 }
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
