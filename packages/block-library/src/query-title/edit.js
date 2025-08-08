/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	AlignmentControl,
	BlockControls,
	InspectorControls,
	useBlockProps,
	Warning,
	HeadingLevelDropdown,
} from '@wordpress/block-editor';
import {
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __, _x, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useArchiveLabel } from './use-archive-label';
import { useToolsPanelDropdownMenuProps } from '../utils/hooks';

const SUPPORTED_TYPES = [ 'archive', 'search' ];

/*
 * QueryTitleEdit component provides the block editor interface for rendering and editing the title
 * of a query-based block, such as archive titles or search result titles.
 *
 * @param {Object} props                        		Component props.
 * @param {Object} props.attributes             		Block attributes.
 * @param {string} props.attributes.type        		The type of query (e.g., 'archive' or 'search').
 * @param {number} props.attributes.level       		The heading level for the title (e.g., 1 for `<h1>`).
 * @param {Array}  props.attributes.levelOptions 		Available heading level options.
 * @param {string} props.attributes.textAlign   		Text alignment for the title (e.g., 'left', 'center').
 * @param {boolean} props.attributes.showPrefix 		Whether to show the archive type prefix (e.g., 'Category:').
 * @param {boolean} props.attributes.showSearchTerm 	Whether to show the search term in the title.
 * @param {Function} props.setAttributes        		Function to update block attributes.
 * @return {JSX.Element} 								The rendered block editor interface for the query title.
 */
export default function QueryTitleEdit( {
	attributes: {
		type,
		level,
		levelOptions,
		textAlign,
		showPrefix,
		showSearchTerm,
	},
	setAttributes,
} ) {
	const { archiveTypeLabel, archiveNameLabel } = useArchiveLabel();
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const TagName = `h${ level }`;
	const blockProps = useBlockProps( {
		className: clsx( 'wp-block-query-title__placeholder', {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
	} );

	if ( ! SUPPORTED_TYPES.includes( type ) ) {
		return (
			<div { ...blockProps }>
				<Warning>{ __( 'Provided type is not supported.' ) }</Warning>
			</div>
		);
	}

	let titleElement;
	if ( type === 'archive' ) {
		let title;
		if ( archiveTypeLabel ) {
			if ( showPrefix ) {
				if ( archiveNameLabel ) {
					title = sprintf(
						/* translators: 1: Archive type title e.g: "Category", 2: Label of the archive e.g: "Shoes" */
						_x( '%1$s: %2$s', 'archive label' ),
						archiveTypeLabel,
						archiveNameLabel
					);
				} else {
					title = sprintf(
						/* translators: %s: Archive type title e.g: "Category", "Tag"... */
						__( '%s: Name' ),
						archiveTypeLabel
					);
				}
			} else if ( archiveNameLabel ) {
				title = archiveNameLabel;
			} else {
				title = sprintf(
					/* translators: %s: Archive type title e.g: "Category", "Tag"... */
					__( '%s name' ),
					archiveTypeLabel
				);
			}
		} else {
			title = showPrefix
				? __( 'Archive type: Name' )
				: __( 'Archive title' );
		}

		titleElement = (
			<>
				<InspectorControls>
					<ToolsPanel
						label={ __( 'Settings' ) }
						resetAll={ () =>
							setAttributes( {
								showPrefix: true,
							} )
						}
						dropdownMenuProps={ dropdownMenuProps }
					>
						<ToolsPanelItem
							hasValue={ () => ! showPrefix }
							label={ __( 'Show archive type in title' ) }
							onDeselect={ () =>
								setAttributes( { showPrefix: true } )
							}
							isShownByDefault
						>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ __( 'Show archive type in title' ) }
								onChange={ () =>
									setAttributes( {
										showPrefix: ! showPrefix,
									} )
								}
								checked={ showPrefix }
							/>
						</ToolsPanelItem>
					</ToolsPanel>
				</InspectorControls>
				<TagName { ...blockProps }>{ title }</TagName>
			</>
		);
	}

	if ( type === 'search' ) {
		titleElement = (
			<>
				<InspectorControls>
					<ToolsPanel
						label={ __( 'Settings' ) }
						resetAll={ () =>
							setAttributes( {
								showSearchTerm: true,
							} )
						}
						dropdownMenuProps={ dropdownMenuProps }
					>
						<ToolsPanelItem
							hasValue={ () => ! showSearchTerm }
							label={ __( 'Show search term in title' ) }
							onDeselect={ () =>
								setAttributes( { showSearchTerm: true } )
							}
							isShownByDefault
						>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ __( 'Show search term in title' ) }
								onChange={ () =>
									setAttributes( {
										showSearchTerm: ! showSearchTerm,
									} )
								}
								checked={ showSearchTerm }
							/>
						</ToolsPanelItem>
					</ToolsPanel>
				</InspectorControls>

				<TagName { ...blockProps }>
					{ showSearchTerm
						? __( 'Search results for: “search term”' )
						: __( 'Search results' ) }
				</TagName>
			</>
		);
	}

	return (
		<>
			<BlockControls group="block">
				<HeadingLevelDropdown
					value={ level }
					options={ levelOptions }
					onChange={ ( newLevel ) =>
						setAttributes( { level: newLevel } )
					}
				/>
				<AlignmentControl
					value={ textAlign }
					onChange={ ( nextAlign ) => {
						setAttributes( { textAlign: nextAlign } );
					} }
				/>
			</BlockControls>
			{ titleElement }
		</>
	);
}
