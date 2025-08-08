/**
 * WordPress dependencies
 */
import { ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useUnsupportedBlocks } from '../../utils';

/*
 * EnhancedPaginationControl component for managing the pagination behavior.
 *
 * @param {Object} props                          	Component props.
 * @param {boolean} props.enhancedPagination      	Indicates whether enhanced pagination is enabled.
 * @param {Function} props.setAttributes          	Callback function to update block attributes.
 * @param {string} props.clientId                 	The client ID of the block.
 * @return {JSX.Element} 							The rendered EnhancedPaginationControl component.
 */
export default function EnhancedPaginationControl( {
	enhancedPagination,
	setAttributes,
	clientId,
} ) {
	const { hasUnsupportedBlocks } = useUnsupportedBlocks( clientId );

	let help = __(
		'Reload the full page—instead of just the posts list—when visitors navigate between pages.'
	);
	if ( hasUnsupportedBlocks ) {
		help = __(
			'Enhancement disabled because there are non-compatible blocks inside the Query block.'
		);
	}

	return (
		<>
			<ToggleControl
				__nextHasNoMarginBottom
				label={ __( 'Reload full page' ) }
				help={ help }
				checked={ ! enhancedPagination }
				disabled={ hasUnsupportedBlocks }
				onChange={ ( value ) => {
					setAttributes( {
						enhancedPagination: ! value,
					} );
				} }
			/>
		</>
	);
}
