/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { store as coreDataStore } from '@wordpress/core-data';

/**
 * Gets a list of term data fields with their values and labels
 * to be consumed in the needed callbacks.
 * If the value is not available based on context, like in templates,
 * it falls back to the default value, label, or key.
 *
 * @param {Object} select  The select function from the data store.
 * @param {Object} context The context provided.
 * @return {Object} List of term data fields with their value and label.
 *
 * @example
 * ```js
 * {
 *     name: {
 *         label: 'Term Name',
 *         value: 'Category Name',
 *     },
 *     count: {
 *         label: 'Term Count',
 *         value: 5,
 *     },
 *     ...
 * }
 * ```
 */
function getTermDataFields( select, context ) {
	const { getEntityRecord } = select( coreDataStore );

	let termDataValues, dataFields;
	if ( context?.taxonomy && context?.termId ) {
		termDataValues = getEntityRecord(
			'taxonomy',
			context?.taxonomy,
			context?.termId
		);

		if ( ! termDataValues && context?.termData ) {
			termDataValues = context.termData;
		}

		if ( termDataValues ) {
			dataFields = {
				name: {
					label: __( 'Term Name' ),
					value: termDataValues?.name,
					type: 'string',
				},
				count: {
					label: __( 'Term Count' ),
					value: termDataValues?.count
						? `(${ termDataValues.count })`
						: `(${ termDataValues?.count })`,
					type: 'string',
				},
				description: {
					label: __( 'Term Description' ),
					value: termDataValues?.description,
					type: 'string',
				},
				slug: {
					label: __( 'Term Slug' ),
					value: termDataValues?.slug,
					type: 'string',
				},
				id: {
					label: __( 'Term ID' ),
					value: context?.termId,
					type: 'string',
				},
			};
		}
	} else if ( context?.termData ) {
		termDataValues = context.termData;
		dataFields = {
			name: {
				label: __( 'Term Name' ),
				value: termDataValues?.name,
				type: 'string',
			},
			count: {
				label: __( 'Term Count' ),
				value: termDataValues?.count
					? `(${ termDataValues.count })`
					: `(${ termDataValues?.count })`,
				type: 'string',
			},
			description: {
				label: __( 'Term Description' ),
				value: termDataValues?.description,
				type: 'string',
			},
			slug: {
				label: __( 'Term Slug' ),
				value: termDataValues?.slug,
				type: 'string',
			},
			id: {
				label: __( 'Term ID' ),
				value: termDataValues?.term_id,
				type: 'string',
			},
		};
	}

	if ( ! dataFields || ! Object.keys( dataFields ).length ) {
		return null;
	}

	return dataFields;
}

/**
 * @type {WPBlockBindingsSource}
 */
export default {
	name: 'core/term-data',
	usesContext: [ 'taxonomy', 'termId', 'termData' ],
	getValues( { select, context, bindings } ) {
		const dataFields = getTermDataFields( select, context );

		const newValues = {};
		for ( const [ attributeName, source ] of Object.entries( bindings ) ) {
			// Use the value, the field label, or the field key.
			const fieldKey = source.args.key;
			const { value: fieldValue, label: fieldLabel } =
				dataFields?.[ fieldKey ] || {};
			newValues[ attributeName ] = fieldValue ?? fieldLabel ?? fieldKey;
		}
		return newValues;
	},
	// eslint-disable-next-line no-unused-vars
	setValues( { dispatch, context, bindings } ) {
		// Terms are typically not editable through block bindings in most contexts.
		return false;
	},
	canUserEditValue( { select, context, args } ) {
		// Terms are typically read-only when displayed.
		if ( context?.termQuery || context?.termQueryId ) {
			return false;
		}

		// Lock editing when `taxonomy` or `termId` is not defined.
		if ( ! context?.taxonomy || ! context?.termId ) {
			return false;
		}

		const fieldValue = getTermDataFields( select, context )?.[ args.key ]
			?.value;
		// Empty string or `false` could be a valid value, so we need to check if the field value is undefined.
		if ( fieldValue === undefined ) {
			return false;
		}

		return false;
	},
	getFieldsList( { select, context } ) {
		return getTermDataFields( select, context );
	},
};
