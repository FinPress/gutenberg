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
	useBlockEditingMode,
} from '@wordpress/block-editor';
import {
	ToggleControl,
	TextControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEntityProp } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import { useToolsPanelDropdownMenuProps } from '../utils/hooks';

export default function TermNameEdit( {
	attributes: { textAlign, isLink, rel, linkTarget },
	setAttributes,
	context: { termType, termId },
} ) {
	const TagName = 'span';
	const blockEditingMode = useBlockEditingMode();
	const showControls = blockEditingMode === 'default';

	const [ fullName ] = useEntityProp( 'taxonomy', termType, 'name', termId );
	const [ link ] = useEntityProp( 'taxonomy', termType, 'link', termId );

	const blockProps = useBlockProps( {
		className: clsx( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
	} );

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	let nameElement = (
		<TagName { ...blockProps }>{ __( 'Term Name' ) }</TagName>
	);

	if ( termType && termId ) {
		nameElement = (
			<TagName
				{ ...blockProps }
				dangerouslySetInnerHTML={ { __html: fullName } }
			/>
		);
	}

	if ( isLink && termType && termId ) {
		nameElement = (
			<TagName { ...blockProps }>
				<a
					href={ link }
					target={ linkTarget }
					rel={ rel }
					onClick={ ( event ) => event.preventDefault() }
					dangerouslySetInnerHTML={ {
						__html: fullName,
					} }
				/>
			</TagName>
		);
	}

	return (
		<>
			{ showControls && (
				<>
					<BlockControls group="block">
						<AlignmentControl
							value={ textAlign }
							onChange={ ( nextAlign ) => {
								setAttributes( { textAlign: nextAlign } );
							} }
						/>
					</BlockControls>

					<InspectorControls>
						<ToolsPanel
							label={ __( 'Settings' ) }
							resetAll={ () => {
								setAttributes( {
									rel: '',
									linkTarget: '_self',
									isLink: false,
								} );
							} }
							dropdownMenuProps={ dropdownMenuProps }
						>
							<ToolsPanelItem
								label={ __( 'Make name a link' ) }
								isShownByDefault
								hasValue={ () => isLink }
								onDeselect={ () =>
									setAttributes( { isLink: false } )
								}
							>
								<ToggleControl
									__nextHasNoMarginBottom
									label={ __( 'Make name a link' ) }
									onChange={ () =>
										setAttributes( { isLink: ! isLink } )
									}
									checked={ isLink }
								/>
							</ToolsPanelItem>
							{ isLink && (
								<>
									<ToolsPanelItem
										label={ __( 'Link target' ) }
										isShownByDefault
										hasValue={ () =>
											linkTarget !== '_self'
										}
										onDeselect={ () =>
											setAttributes( {
												linkTarget: '_self',
											} )
										}
									>
										<ToggleControl
											__nextHasNoMarginBottom
											label={ __( 'Open in new tab' ) }
											onChange={ ( value ) =>
												setAttributes( {
													linkTarget: value
														? '_blank'
														: '_self',
													rel: value
														? 'noopener'
														: '',
												} )
											}
											checked={ linkTarget === '_blank' }
										/>
									</ToolsPanelItem>
									<ToolsPanelItem
										label={ __( 'Link rel' ) }
										isShownByDefault
										hasValue={ () => !! rel }
										onDeselect={ () =>
											setAttributes( { rel: '' } )
										}
									>
										<TextControl
											__nextHasNoMarginBottom
											__next40pxDefaultSize
											label={ __( 'Link rel' ) }
											value={ rel }
											onChange={ ( newRel ) =>
												setAttributes( { rel: newRel } )
											}
										/>
									</ToolsPanelItem>
								</>
							) }
						</ToolsPanel>
					</InspectorControls>
				</>
			) }

			{ nameElement }
		</>
	);
}
