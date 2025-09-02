/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	getBlockBindingsSource,
	getBlockBindingsSources,
} from '@wordpress/blocks';
import {
	__experimentalItemGroup as ItemGroup,
	__experimentalItem as Item,
	__experimentalText as Text,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalVStack as VStack,
	ComboboxControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useContext } from '@wordpress/element';
import { useViewportMatch } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import {
	canBindAttribute,
	getBindableAttributes,
	useBlockBindingsUtils,
} from '../utils/block-bindings';
import InspectorControls from '../components/inspector-controls';
import BlockContext from '../components/block-context';
import { store as blockEditorStore } from '../store';

const EMPTY_OBJECT = {};

/**
 * Converts nested fieldsList format to options array format for ComboboxControl
 * @param {Object} fieldsObject - Object with nested fields data from multiple sources
 * @return {Array} Array of options with value and label properties
 */
const convertToOptions = ( fieldsObject ) => {
	if ( ! fieldsObject || typeof fieldsObject !== 'object' ) {
		return [];
	}

	const options = [];

	// Iterate through each source (e.g., "bbe/smile-cry")
	Object.entries( fieldsObject ).forEach( ( [ sourceName, fields ] ) => {
		// Iterate through each field within the source
		Object.entries( fields ).forEach( ( [ fieldKey, fieldData ] ) => {
			options.push( {
				value: fieldKey,
				label: fieldData?.label || fieldKey,
				sourceName,
			} );
		} );
	} );

	return options;
};

const useToolsPanelDropdownMenuProps = () => {
	const isMobile = useViewportMatch( 'medium', '<' );
	return ! isMobile
		? {
				popoverProps: {
					placement: 'left-start',
					// For non-mobile, inner sidebar width (248px) - button width (24px) - border (1px) + padding (16px) + spacing (20px)
					offset: 259,
				},
		  }
		: {};
};

function BlockBindingsAttribute( { attribute, binding, fieldsList } ) {
	const { source: sourceName, args } = binding || {};
	const sourceProps = getBlockBindingsSource( sourceName );
	const isSourceInvalid = ! sourceProps;
	return (
		<VStack className="block-editor-bindings__item" spacing={ 0 }>
			<Text truncate>{ attribute }</Text>
			{ !! binding && (
				<Text
					truncate
					variant={ ! isSourceInvalid && 'muted' }
					isDestructive={ isSourceInvalid }
				>
					{ isSourceInvalid
						? __( 'Invalid source' )
						: fieldsList?.[ sourceName ]?.[ args?.key ]?.label ||
						  sourceProps?.label ||
						  sourceName }
				</Text>
			) }
		</VStack>
	);
}

function ReadOnlyBlockBindingsPanelItems( { bindings, fieldsList } ) {
	return (
		<>
			{ Object.entries( bindings ).map( ( [ attribute, binding ] ) => (
				<Item key={ attribute }>
					<BlockBindingsAttribute
						attribute={ attribute }
						binding={ binding }
						fieldsList={ fieldsList }
					/>
				</Item>
			) ) }
		</>
	);
}

function EditableBlockBindingsPanelItems( {
	attributes,
	bindings,
	fieldsList,
} ) {
	const { updateBlockBindings } = useBlockBindingsUtils();
	return (
		<>
			{ attributes.map( ( attribute ) => {
				const binding = bindings[ attribute ];
				return (
					<ToolsPanelItem
						key={ attribute }
						hasValue={ () => !! binding }
						label={ attribute }
						onDeselect={ () => {
							updateBlockBindings( {
								[ attribute ]: undefined,
							} );
						} }
						isShownByDefault
					>
						<ComboboxControl
							label={ attribute }
							placeholder={ __( 'Select a source' ) }
							options={ convertToOptions( fieldsList ) }
							value={ binding?.args?.key || '' }
							onChange={ ( value ) => {
								// Find the source name for the selected value
								let selectedSourceName = '';
								Object.entries( fieldsList ).forEach(
									( [ sourceName, fields ] ) => {
										if ( fields[ value ] ) {
											selectedSourceName = sourceName;
										}
									}
								);

								updateBlockBindings( {
									[ attribute ]: {
										source: selectedSourceName,
										args: { key: value },
									},
								} );
							} }
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							__experimentalRenderItem={ ( { item } ) => {
								const { label, sourceName } = item;
								return (
									<div>
										<div
											style={ { marginBottom: '0.2rem' } }
										>
											{ label }
										</div>
										<small>
											{ sprintf(
												/* translators: %s: Name of the data source */
												__( 'Source: %s' ),
												sourceName
											) }
										</small>
									</div>
								);
							} }
						/>
					</ToolsPanelItem>
				);
			} ) }
		</>
	);
}

export const BlockBindingsPanel = ( { name: blockName, metadata } ) => {
	const blockContext = useContext( BlockContext );
	const { removeAllBlockBindings } = useBlockBindingsUtils();
	const bindableAttributes = getBindableAttributes( blockName );
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	// `useSelect` is used purposely here to ensure `getFieldsList`
	// is updated whenever there are updates in block context.
	// `source.getFieldsList` may also call a selector via `select`.
	const _fieldsList = {};
	const { fieldsList, canUpdateBlockBindings } = useSelect(
		( select ) => {
			if ( ! bindableAttributes || bindableAttributes.length === 0 ) {
				return EMPTY_OBJECT;
			}
			const registeredSources = getBlockBindingsSources();
			Object.entries( registeredSources ).forEach(
				( [ sourceName, { getFieldsList, usesContext } ] ) => {
					if ( getFieldsList ) {
						// Populate context.
						const context = {};
						if ( usesContext?.length ) {
							for ( const key of usesContext ) {
								context[ key ] = blockContext[ key ];
							}
						}
						const sourceList = getFieldsList( {
							select,
							context,
						} );
						// Only add source if the list is not empty.
						if ( Object.keys( sourceList || {} ).length ) {
							_fieldsList[ sourceName ] = { ...sourceList };
						}
					}
				}
			);
			return {
				fieldsList:
					Object.values( _fieldsList ).length > 0
						? _fieldsList
						: EMPTY_OBJECT,
				canUpdateBlockBindings:
					select( blockEditorStore ).getSettings()
						.canUpdateBlockBindings,
			};
		},
		[ blockContext, bindableAttributes ]
	);
	// Return early if there are no bindable attributes.
	if ( ! bindableAttributes || bindableAttributes.length === 0 ) {
		return null;
	}
	// Filter bindings to only show bindable attributes and remove pattern overrides.
	const { bindings } = metadata || {};
	const filteredBindings = { ...bindings };
	Object.keys( filteredBindings ).forEach( ( key ) => {
		if (
			! canBindAttribute( blockName, key ) ||
			filteredBindings[ key ].source === 'core/pattern-overrides'
		) {
			delete filteredBindings[ key ];
		}
	} );

	// Lock the UI when the user can't update bindings or there are no fields to connect to.
	const readOnly =
		! canUpdateBlockBindings || ! Object.keys( fieldsList ).length;

	if ( readOnly && Object.keys( filteredBindings ).length === 0 ) {
		return null;
	}

	return (
		<InspectorControls group="bindings">
			<ToolsPanel
				label={ __( 'Attributes' ) }
				resetAll={ () => {
					removeAllBlockBindings();
				} }
				dropdownMenuProps={ dropdownMenuProps }
				className="block-editor-bindings__panel"
			>
				<ItemGroup isSeparated>
					{ readOnly ? (
						<ReadOnlyBlockBindingsPanelItems
							bindings={ filteredBindings }
							fieldsList={ fieldsList }
						/>
					) : (
						<EditableBlockBindingsPanelItems
							attributes={ bindableAttributes }
							bindings={ filteredBindings }
							fieldsList={ fieldsList }
						/>
					) }
				</ItemGroup>
				{ /*
					Use a div element to make the ToolsPanelHiddenInnerWrapper
					toggle the visibility of this help text automatically.
				*/ }
				<Text as="div" variant="muted">
					<p>
						{ __(
							'Attributes connected to custom fields or other dynamic data.'
						) }
					</p>
				</Text>
			</ToolsPanel>
		</InspectorControls>
	);
};

export default {
	edit: BlockBindingsPanel,
	attributeKeys: [ 'metadata' ],
	hasSupport() {
		return true;
	},
};
