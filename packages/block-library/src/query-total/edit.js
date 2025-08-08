/**
 * WordPress dependencies
 */
import { useBlockProps, BlockControls } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarDropdownMenu } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { resultsFound, displayingResults } from './icons';

/*
 * QueryTotalEdit component provides the block editor interface for rendering and editing
 * the total query results or a range display for query results.
 *
 * @param {Object} props                        	Component props.
 * @param {Object} props.attributes             	Block attributes.
 * @param {string} props.attributes.displayType 	The selected display type ('total-results' or 'range-display').
 * @param {Function} props.setAttributes        	Function to update block attributes.
 * @return {JSX.Element} 							The rendered block editor interface for the query total display.
 */
export default function QueryTotalEdit( { attributes, setAttributes } ) {
	const { displayType } = attributes;

	// Block properties and classes.
	const blockProps = useBlockProps();

	const getButtonPositionIcon = () => {
		switch ( displayType ) {
			case 'total-results':
				return resultsFound;
			case 'range-display':
				return displayingResults;
		}
	};

	const buttonPositionControls = [
		{
			role: 'menuitemradio',
			title: __( 'Total results' ),
			isActive: displayType === 'total-results',
			icon: resultsFound,
			onClick: () => {
				setAttributes( { displayType: 'total-results' } );
			},
		},
		{
			role: 'menuitemradio',
			title: __( 'Range display' ),
			isActive: displayType === 'range-display',
			icon: displayingResults,
			onClick: () => {
				setAttributes( { displayType: 'range-display' } );
			},
		},
	];

	// Controls for the block.
	const controls = (
		<BlockControls>
			<ToolbarGroup>
				<ToolbarDropdownMenu
					icon={ getButtonPositionIcon() }
					label={ __( 'Change display type' ) }
					controls={ buttonPositionControls }
				/>
			</ToolbarGroup>
		</BlockControls>
	);

	// Render output based on the selected display type.
	const renderDisplay = () => {
		if ( displayType === 'total-results' ) {
			return <>{ __( '12 results found' ) }</>;
		}

		if ( displayType === 'range-display' ) {
			return <>{ __( 'Displaying 1 – 10 of 12' ) }</>;
		}

		return null;
	};

	return (
		<div { ...blockProps }>
			{ controls }
			{ renderDisplay() }
		</div>
	);
}
