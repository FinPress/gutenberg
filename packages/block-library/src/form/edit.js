/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	SelectControl,
	TextControl,
	Button,
	BaseControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { plus, trash } from '@wordpress/icons';
import { Fragment } from '@wordpress/element';
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { useToolsPanelDropdownMenuProps } from '../utils/hooks';
import {
	formSubmissionNotificationSuccess,
	formSubmissionNotificationError,
} from './utils.js';

const TEMPLATE = [
	formSubmissionNotificationSuccess,
	formSubmissionNotificationError,
	[
		'core/form-input',
		{
			type: 'text',
			label: __( 'Name' ),
			required: true,
		},
	],
	[
		'core/form-input',
		{
			type: 'email',
			label: __( 'Email' ),
			required: true,
		},
	],
	[
		'core/form-input',
		{
			type: 'textarea',
			label: __( 'Comment' ),
			required: true,
		},
	],
	[ 'core/form-submit-button', {} ],
];

const Edit = ( { attributes, setAttributes, clientId } ) => {
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const resetAllSettings = () => {
		setAttributes( {
			submissionMethod: 'email',
			email: undefined,
			action: undefined,
			method: 'post',
			hiddenFields: [],
		} );
	};

	const {
		action,
		method,
		email,
		submissionMethod,
		hiddenFields = [],
	} = attributes;
	const blockProps = useBlockProps();

	const { hasInnerBlocks } = useSelect(
		( select ) => {
			const { getBlock } = select( blockEditorStore );
			const block = getBlock( clientId );
			return {
				hasInnerBlocks: !! ( block && block.innerBlocks.length ),
			};
		},
		[ clientId ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
		renderAppender: hasInnerBlocks
			? undefined
			: InnerBlocks.ButtonBlockAppender,
	} );

	const instanceId = useInstanceId( Edit );
	const id = `inspector-controls-${ instanceId }`;

	const addHiddenField = () => {
		const newHiddenField = [
			...hiddenFields,
			{
				id: `hidden_field_${ Date.now() }`,
				name: '',
				value: '',
			},
		];
		setAttributes( { hiddenFields: newHiddenField } );
	};

	const removeHiddenField = ( index ) => {
		const newHiddenFields = hiddenFields.filter( ( _, i ) => i !== index );
		setAttributes( { hiddenFields: newHiddenFields } );
	};

	const updateHiddenField = ( index, field, value ) => {
		const newHiddenFields = [ ...hiddenFields ];
		newHiddenFields[ index ] = {
			...newHiddenFields[ index ],
			[ field ]: value,
		};
		setAttributes( { hiddenFields: newHiddenFields } );
	};

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					dropdownMenuProps={ dropdownMenuProps }
					label={ __( 'Settings' ) }
					resetAll={ resetAllSettings }
				>
					<ToolsPanelItem
						hasValue={ () => submissionMethod !== 'email' }
						label={ __( 'Submissions method' ) }
						onDeselect={ () =>
							setAttributes( {
								submissionMethod: 'email',
							} )
						}
						isShownByDefault
					>
						<SelectControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							label={ __( 'Submissions method' ) }
							options={ [
								// TODO: Allow plugins to add their own submission methods.
								{
									label: __( 'Send email' ),
									value: 'email',
								},
								{
									label: __( '- Custom -' ),
									value: 'custom',
								},
							] }
							value={ submissionMethod }
							onChange={ ( value ) =>
								setAttributes( { submissionMethod: value } )
							}
							help={
								submissionMethod === 'custom'
									? __(
											'Select the method to use for form submissions. Additional options for the "custom" mode can be found in the "Advanced" section.'
									  )
									: __(
											'Select the method to use for form submissions.'
									  )
							}
						/>
					</ToolsPanelItem>
					{ submissionMethod === 'email' && (
						<ToolsPanelItem
							hasValue={ () => !! email }
							label={ __( 'Email for form submissions' ) }
							onDeselect={ () =>
								setAttributes( {
									email: undefined,
									action: undefined,
									method: 'post',
								} )
							}
							isShownByDefault
						>
							<TextControl
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								autoComplete="off"
								label={ __( 'Email for form submissions' ) }
								value={ email || '' }
								required
								onChange={ ( value ) => {
									setAttributes( { email: value } );
									setAttributes( {
										action: `mailto:${ value }`,
									} );
									setAttributes( { method: 'post' } );
								} }
								help={ __(
									'The email address where form submissions will be sent. Separate multiple email addresses with a comma.'
								) }
								type="email"
							/>
						</ToolsPanelItem>
					) }
					<ToolsPanelItem
						hasValue={ () => hiddenFields.length > 0 }
						label={ __( 'Hidden fields' ) }
						onDeselect={ () =>
							setAttributes( { hiddenFields: [] } )
						}
						isShownByDefault
					>
						<BaseControl
							__nextHasNoMarginBottom
							id={ id }
							label={ __( 'Hidden fields' ) }
							help={ __(
								'Add hidden fields to the form. These fields will not be visible to users but will be included in the form submission.'
							) }
						>
							<VStack spacing={ 2 }>
								{ hiddenFields.map( ( field, index ) => (
									<Fragment key={ field.id }>
										<TextControl
											__nextHasNoMarginBottom
											__next40pxDefaultSize
											label={ __( 'Field Name' ) }
											value={ field.name }
											onChange={ ( value ) =>
												updateHiddenField(
													index,
													'name',
													value
												)
											}
										/>
										<TextControl
											__nextHasNoMarginBottom
											__next40pxDefaultSize
											label={ __( 'Field Value' ) }
											value={ field.value }
											onChange={ ( value ) =>
												updateHiddenField(
													index,
													'value',
													value
												)
											}
										/>
										<Button
											__nextHasNoMarginBottom
											__next40pxDefaultSize
											isDestructive
											variant="secondary"
											icon={ trash }
											onClick={ () =>
												removeHiddenField( index )
											}
										>
											{ __( 'Remove field' ) }
										</Button>
									</Fragment>
								) ) }

								<Button
									__nextHasNoMarginBottom
									__next40pxDefaultSize
									variant="secondary"
									onClick={ addHiddenField }
									icon={ plus }
								>
									{ __( 'Add hidden field' ) }
								</Button>
							</VStack>
						</BaseControl>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			{ submissionMethod !== 'email' && (
				<InspectorControls group="advanced">
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Method' ) }
						options={ [
							{ label: 'Get', value: 'get' },
							{ label: 'Post', value: 'post' },
						] }
						value={ method }
						onChange={ ( value ) =>
							setAttributes( { method: value } )
						}
						help={ __(
							'Select the method to use for form submissions.'
						) }
					/>
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						autoComplete="off"
						label={ __( 'Form action' ) }
						value={ action }
						onChange={ ( newVal ) => {
							setAttributes( {
								action: newVal,
							} );
						} }
						help={ __(
							'The URL where the form should be submitted.'
						) }
						type="url"
					/>
				</InspectorControls>
			) }
			<form
				{ ...innerBlocksProps }
				encType={ submissionMethod === 'email' ? 'text/plain' : null }
			/>
		</>
	);
};
export default Edit;
