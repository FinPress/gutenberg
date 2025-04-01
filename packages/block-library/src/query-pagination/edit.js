/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { QueryPaginationArrowControls } from './query-pagination-arrow-controls';
import { QueryPaginationLabelControl } from './query-pagination-label-control';
import { useToolsPanelDropdownMenuProps } from '../utils/hooks';
import PagesControl from '../query/edit/inspector-controls/pages-control';

const TEMPLATE = [
	[ 'core/query-pagination-previous' ],
	[ 'core/query-pagination-numbers' ],
	[ 'core/query-pagination-next' ],
];

export default function QueryPaginationEdit( {
	attributes: { paginationArrow, showLabel, pages },
	setAttributes,
	clientId,
} ) {
	const hasNextPreviousBlocks = useSelect(
		( select ) => {
			const { getBlocks } = select( blockEditorStore );
			const innerBlocks = getBlocks( clientId );
			/**
			 * Show the `paginationArrow` and `showLabel` controls only if a
			 * `QueryPaginationNext/Previous` block exists.
			 */
			return innerBlocks?.find( ( innerBlock ) => {
				return [
					'core/query-pagination-next',
					'core/query-pagination-previous',
				].includes( innerBlock.name );
			} );
		},
		[ clientId ]
	);

	const parentClientId = useSelect(
		( select ) => {
			const { getBlockParents } = select( blockEditorStore );
			return getBlockParents( clientId )[ 0 ];
		},
		[ clientId ]
	);

	const parentAttributes = useSelect(
		( select ) => {
			const { getBlockAttributes } = select( blockEditorStore );
			return parentClientId ? getBlockAttributes( parentClientId ) : {};
		},
		[ parentClientId ]
	);
	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	const handlePagesChange = ( newPages ) => {
		setAttributes( { pages: newPages?.pages } );

		if ( parentClientId ) {
			if ( parentAttributes?.query?.pages !== newPages ) {
				updateBlockAttributes( parentClientId, {
					query: {
						...parentAttributes.query,
						pages: newPages?.pages,
					},
				} );
			}
		}
	};

	const { __unstableMarkNextChangeAsNotPersistent } =
		useDispatch( blockEditorStore );
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
	} );

	// Always show label text if paginationArrow is set to 'none'.
	useEffect( () => {
		if ( paginationArrow === 'none' && ! showLabel ) {
			__unstableMarkNextChangeAsNotPersistent();
			setAttributes( { showLabel: true } );
		}
	}, [
		paginationArrow,
		setAttributes,
		showLabel,
		__unstableMarkNextChangeAsNotPersistent,
	] );

	return (
		<>
			{ hasNextPreviousBlocks && (
				<InspectorControls>
					<ToolsPanel
						label={ __( 'Settings' ) }
						resetAll={ () => {
							setAttributes( {
								paginationArrow: 'none',
								showLabel: true,
								pages: 0,
							} );
						} }
						dropdownMenuProps={ dropdownMenuProps }
					>
						<ToolsPanelItem
							hasValue={ () => paginationArrow !== 'none' }
							label={ __( 'Pagination arrow' ) }
							onDeselect={ () =>
								setAttributes( { paginationArrow: 'none' } )
							}
							isShownByDefault
						>
							<QueryPaginationArrowControls
								value={ paginationArrow }
								onChange={ ( value ) => {
									setAttributes( { paginationArrow: value } );
								} }
							/>
						</ToolsPanelItem>
						{ paginationArrow !== 'none' && (
							<ToolsPanelItem
								hasValue={ () => ! showLabel }
								label={ __( 'Show text' ) }
								onDeselect={ () =>
									setAttributes( { showLabel: true } )
								}
								isShownByDefault
							>
								<QueryPaginationLabelControl
									value={ showLabel }
									onChange={ ( value ) => {
										setAttributes( { showLabel: value } );
									} }
								/>
							</ToolsPanelItem>
						) }
						<ToolsPanelItem
							label={ __( 'Max pages to show' ) }
							hasValue={ () => pages > 0 }
							onDeselect={ () => setAttributes( { pages: 0 } ) }
							isShownByDefault
						>
							<PagesControl
								pages={ pages }
								onChange={ handlePagesChange }
							/>
						</ToolsPanelItem>
					</ToolsPanel>
				</InspectorControls>
			) }
			<nav { ...innerBlocksProps } />
		</>
	);
}
