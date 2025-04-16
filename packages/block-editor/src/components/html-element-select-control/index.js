/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { SelectControl, Notice } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '../../store';
import { htmlElementMessages } from './messages';

/**
 * Checks if a block has a specific HTML element tag.
 *
 * @param {Object} block Block object to check.
 * @param {string} tag   HTML tag to look for.
 * @return {boolean}     Whether the block has the specified HTML element.
 */
const blockHasHtmlTag = ( block, tag ) => {
	if ( ! block ) {
		return false;
	}

	if ( block.attributes && block.attributes.tagName === tag ) {
		return true;
	}

	if ( block.innerBlocks && block.innerBlocks.length ) {
		return block.innerBlocks.some( ( innerBlock ) =>
			blockHasHtmlTag( innerBlock, tag )
		);
	}

	return false;
};

/**
 * Renders a SelectControl for choosing HTML elements with validation
 * to prevent duplicate <main> elements.
 *
 * @param {Object}   props                 Component props.
 * @param {string}   props.tagName         The current HTML tag name.
 * @param {Function} props.onChange        Function to call when the tag is changed.
 * @param {string}   props.currentClientId The client ID of the current block.
 * @param {Array}    props.options         SelectControl options (optional).
 * @param {boolean}  props.checkForMainTag Whether to check for duplicate main tags (optional). Default: true.
 *
 * @return {Component} The HTML element select control with validation.
 */
export default function HTMLElementSelectControl( {
	tagName,
	onChange,
	currentClientId,
	options = [
		{ label: __( 'Default (<div>)' ), value: 'div' },
		{ label: '<header>', value: 'header' },
		{ label: '<main>', value: 'main' },
		{ label: '<section>', value: 'section' },
		{ label: '<article>', value: 'article' },
		{ label: '<aside>', value: 'aside' },
		{ label: '<footer>', value: 'footer' },
	],
	checkForMainTag = true,
} ) {
	const { hasMultipleMainElements, hasMainElementElsewhere } = useSelect(
		( select ) => {
			if ( ! checkForMainTag ) {
				return {
					hasMultipleMainElements: false,
					hasMainElementElsewhere: false,
				};
			}

			const { getBlocks, getBlock } = select( blockEditorStore );
			const allBlocks = getBlocks();
			const currentBlock = getBlock( currentClientId );

			let mainElementCount = 0;

			// Check if the current block or its inner blocks have a main element.
			if ( currentBlock && tagName === 'main' ) {
				mainElementCount++;
			}

			const hasMainElsewhere = allBlocks.some( ( block ) => {
				if ( block.clientId === currentClientId ) {
					return false;
				}

				return blockHasHtmlTag( block, 'main' );
			} );

			if ( hasMainElsewhere ) {
				mainElementCount++;
			}

			return {
				hasMultipleMainElements: mainElementCount > 1,
				hasMainElementElsewhere: hasMainElsewhere,
			};
		},
		[ currentClientId, tagName, checkForMainTag ]
	);

	// Create a modified options array that disables the main option if needed.
	const modifiedOptions = options.map( ( option ) => {
		if (
			option.value === 'main' &&
			hasMainElementElsewhere &&
			tagName !== 'main'
		) {
			return {
				...option,
				disabled: true,
				label: `${ option.label } (${ __( 'Already in use' ) })`,
			};
		}
		return option;
	} );

	return (
		<>
			{ tagName === 'main' && hasMultipleMainElements && (
				<Notice status="warning" isDismissible={ false }>
					{ __(
						'Multiple <main> elements detected. This is not valid HTML and may cause accessibility issues. Please change this HTML element.'
					) }
				</Notice>
			) }

			<SelectControl
				__nextHasNoMarginBottom
				__next40pxDefaultSize
				label={ __( 'HTML element' ) }
				options={ modifiedOptions }
				value={ tagName }
				onChange={ onChange }
				help={ htmlElementMessages[ tagName ] }
			/>
		</>
	);
}
