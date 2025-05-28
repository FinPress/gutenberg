/**
 * WordPress dependencies
 */
import {
	BlockControls,
	BlockIcon,
	InspectorControls,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	Placeholder,
	ToggleControl,
	SelectControl,
	ToolbarButton,
	ToolbarGroup,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { renderToString } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';
import { store as noticeStore } from '@wordpress/notices';
import { tableOfContents as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import TableOfContentsList from './list';
import { linearToNestedHeadingList } from './utils';
import { useObserveHeadings } from './hooks';
import { useToolsPanelDropdownMenuProps } from '../utils/hooks';

/** @typedef {import('./utils').HeadingData} HeadingData */

/**
 * Table of Contents block edit component.
 *
 * @param {Object}                       props                                   The props.
 * @param {Object}                       props.attributes                        The block attributes.
 * @param {HeadingData[]}                props.attributes.headings               The list of data for each heading in the post.
 * @param {boolean}                      props.attributes.onlyIncludeCurrentPage Whether to only include headings from the current page (if the post is paginated).
 * @param {number|undefined}             props.attributes.maxLevel               The maximum heading level to include, or null to include all levels.
 * @param {string[]}                     props.attributes.hiddenHeadings         Array of heading content that should be hidden from TOC.
 * @param {string}                       props.clientId                          The client id.
 * @param {(attributes: Object) => void} props.setAttributes                     The set attributes function.
 *
 * @return {Component} The component.
 */
export default function TableOfContentsEdit( {
	attributes: {
		headings = [],
		onlyIncludeCurrentPage,
		maxLevel,
		hiddenHeadings = [],
	},
	clientId,
	setAttributes,
} ) {
	useObserveHeadings( clientId );

	const blockProps = useBlockProps();
	const instanceId = useInstanceId(
		TableOfContentsEdit,
		'table-of-contents'
	);

	// Get all heading blocks for the visibility controls
	const { allHeadingBlocks } = useSelect( ( select ) => {
		const { getBlocksByName, getBlockAttributes } =
			select( blockEditorStore );
		const headingIds = getBlocksByName( 'core/heading' );

		const headingBlocks = headingIds
			.map( ( headingId ) => {
				const attributes = getBlockAttributes( headingId );
				return {
					content:
						attributes?.content?.replace( /<[^>]*>?/g, '' ) ||
						__( 'Untitled' ),
					level: attributes?.level || 2,
				};
			} )
			.filter( ( heading ) => heading.content.trim() !== '' );

		return {
			allHeadingBlocks: headingBlocks,
		};
	}, [] );

	// If a user clicks to a link prevent redirection and show a warning.
	const { createWarningNotice } = useDispatch( noticeStore );
	const showRedirectionPreventedNotice = ( event ) => {
		event.preventDefault();
		createWarningNotice( __( 'Links are disabled in the editor.' ), {
			id: `block-library/core/table-of-contents/redirection-prevented/${ instanceId }`,
			type: 'snackbar',
		} );
	};

	const canInsertList = useSelect(
		( select ) => {
			const { getBlockRootClientId, canInsertBlockType } =
				select( blockEditorStore );
			const rootClientId = getBlockRootClientId( clientId );

			return canInsertBlockType( 'core/list', rootClientId );
		},
		[ clientId ]
	);

	const { replaceBlocks } = useDispatch( blockEditorStore );
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();
	const headingTree = linearToNestedHeadingList( headings );

	/**
	 * Toggle the visibility of a heading in the table of contents.
	 *
	 * @param {string} headingContent Heading content to compare against hiddenHeadings.
	 *
	 * @return {void}
	 */
	const toggleHeadingVisibility = ( headingContent ) => {
		const newHiddenHeadings = hiddenHeadings.includes( headingContent )
			? hiddenHeadings.filter( ( id ) => id !== headingContent )
			: [ ...hiddenHeadings, headingContent ];

		setAttributes( { hiddenHeadings: newHiddenHeadings } );
	};

	const toolbarControls = canInsertList && (
		<BlockControls>
			<ToolbarGroup>
				<ToolbarButton
					onClick={ () =>
						replaceBlocks(
							clientId,
							createBlock( 'core/list', {
								ordered: true,
								values: renderToString(
									<TableOfContentsList
										nestedHeadingList={ headingTree }
									/>
								),
							} )
						)
					}
				>
					{ __( 'Convert to static list' ) }
				</ToolbarButton>
			</ToolbarGroup>
		</BlockControls>
	);

	const inspectorControls = (
		<InspectorControls>
			<ToolsPanel
				label={ __( 'Settings' ) }
				resetAll={ () => {
					setAttributes( {
						onlyIncludeCurrentPage: false,
						maxLevel: undefined,
					} );
				} }
				dropdownMenuProps={ dropdownMenuProps }
			>
				<ToolsPanelItem
					hasValue={ () => !! onlyIncludeCurrentPage }
					label={ __( 'Only include current page' ) }
					onDeselect={ () =>
						setAttributes( { onlyIncludeCurrentPage: false } )
					}
					isShownByDefault
				>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Only include current page' ) }
						checked={ onlyIncludeCurrentPage }
						onChange={ ( value ) =>
							setAttributes( { onlyIncludeCurrentPage: value } )
						}
						help={
							onlyIncludeCurrentPage
								? __(
										'Only including headings from the current page (if the post is paginated).'
								  )
								: __(
										'Include headings from all pages (if the post is paginated).'
								  )
						}
					/>
				</ToolsPanelItem>
				<ToolsPanelItem
					hasValue={ () => !! maxLevel }
					label={ __( 'Limit heading levels' ) }
					onDeselect={ () =>
						setAttributes( { maxLevel: undefined } )
					}
					isShownByDefault
				>
					<SelectControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __( 'Include headings down to level' ) }
						value={ maxLevel || '' }
						options={ [
							{ value: '', label: __( 'All levels' ) },
							{ value: '1', label: __( 'Heading 1' ) },
							{ value: '2', label: __( 'Heading 2' ) },
							{ value: '3', label: __( 'Heading 3' ) },
							{ value: '4', label: __( 'Heading 4' ) },
							{ value: '5', label: __( 'Heading 5' ) },
							{ value: '6', label: __( 'Heading 6' ) },
						] }
						onChange={ ( value ) =>
							setAttributes( {
								maxLevel: value ? parseInt( value ) : undefined,
							} )
						}
						help={
							! maxLevel
								? __(
										'Including all heading levels in the table of contents.'
								  )
								: __(
										'Only include headings up to and including this level.'
								  )
						}
					/>
				</ToolsPanelItem>
			</ToolsPanel>
			{ allHeadingBlocks.length > 0 && (
				<ToolsPanel
					label={ __( 'Heading Visibility' ) }
					resetAll={ () => {
						setAttributes( { hiddenHeadings: [] } );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					{ allHeadingBlocks.map( ( heading ) => (
						<ToolsPanelItem
							key={ heading.content }
							hasValue={ () =>
								hiddenHeadings.includes( heading.content )
							}
							label={ heading.content }
							onDeselect={ () =>
								toggleHeadingVisibility( heading.content )
							}
							isShownByDefault={ false }
						>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ heading.content }
								checked={
									! hiddenHeadings.includes( heading.content )
								}
								onChange={ () =>
									toggleHeadingVisibility( heading.content )
								}
								help={
									! hiddenHeadings.includes( heading.content )
										? __(
												'This heading will appear in the table of contents.'
										  )
										: __(
												'This heading will be hidden from the table of contents.'
										  )
								}
							/>
						</ToolsPanelItem>
					) ) }
				</ToolsPanel>
			) }
		</InspectorControls>
	);

	// If there are no headings or the only heading is empty.
	// Note that the toolbar controls are intentionally omitted since the
	// "Convert to static list" option is useless to the placeholder state.
	if ( headings.length === 0 ) {
		return (
			<>
				<div { ...blockProps }>
					<Placeholder
						icon={ <BlockIcon icon={ icon } /> }
						label={ __( 'Table of Contents' ) }
						instructions={ __(
							'Start adding Heading blocks to create a table of contents. Headings with HTML anchors will be linked here.'
						) }
					/>
				</div>
				{ inspectorControls }
			</>
		);
	}

	return (
		<>
			<nav { ...blockProps }>
				<ol>
					<TableOfContentsList
						nestedHeadingList={ headingTree }
						disableLinkActivation
						onClick={ showRedirectionPreventedNotice }
					/>
				</ol>
			</nav>
			{ toolbarControls }
			{ inspectorControls }
		</>
	);
}
