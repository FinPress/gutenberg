/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { columns, column } from '@wordpress/icons';
import { __experimentalBlockVariationPicker as BlockVariationPicker } from '@wordpress/block-editor';

const mockVariations = [
	{
		name: 'two-columns',
		title: 'Two columns; equal split',
		description: 'Two columns of the same width',
		icon: column,
		innerBlocks: [
			[ 'core/column', {} ],
			[ 'core/column', {} ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'three-columns',
		title: 'Three columns; equal split',
		description: 'Three columns of the same width',
		icon: columns,
		innerBlocks: [
			[ 'core/column', {} ],
			[ 'core/column', {} ],
			[ 'core/column', {} ],
		],
		scope: [ 'block' ],
	},
];

const meta = {
	title: 'BlockEditor/BlockVariationPicker',
	component: BlockVariationPicker,
	parameters: {
		docs: {
			description: {
				component:
					'The BlockVariationPicker component allows users to select from different variations of a block. This is commonly used for "Columns" and "Query Loop" blocks.',
			},
		},
	},
	argTypes: {
		label: {
			control: 'text',
			description:
				'The label displayed at the top of the variation picker.',
			defaultValue: 'Choose variation',
		},
		instructions: {
			control: 'text',
			description: 'Instructions displayed below the label.',
			defaultValue: 'Select a variation to start with:',
		},
		icon: {
			control: 'text',
			description: 'Icon displayed alongside the label.',
			defaultValue: 'layout',
		},
		variations: {
			control: false,
			description: 'Array of block variations to display.',
		},
		allowSkip: {
			control: 'boolean',
			description: 'Determines whether the skip button is displayed.',
			defaultValue: false,
		},
		onSelect: {
			action: 'onSelect',
			description:
				'Callback triggered when a variation is selected. Receives the selected variation as an argument.',
		},
	},
};

export default meta;

export const Default = {
	render: function Template( {
		label,
		instructions,
		icon,
		allowSkip,
		onSelect,
	} ) {
		const variations =
			useSelect( ( select ) => {
				try {
					const { getBlockVariations } = select( blocksStore );
					const realVariations = getBlockVariations(
						'core/columns',
						'block'
					);
					return realVariations?.length
						? realVariations
						: mockVariations;
				} catch ( error ) {
					return mockVariations;
				}
			}, [] ) || mockVariations;

		const [ selectedVariation, setSelectedVariation ] = useState( null );

		const handleSelect = ( variation ) => {
			setSelectedVariation( variation );
			onSelect( variation );
		};

		return (
			<div>
				<BlockVariationPicker
					label={ label }
					instructions={ instructions }
					icon={ icon }
					variations={ variations }
					onSelect={ handleSelect }
					allowSkip={ allowSkip }
				/>
				{ selectedVariation && (
					<div style={ { marginTop: '20px' } }>
						<strong>{ __( 'Selected Variation:' ) }</strong>
						<pre>
							{ JSON.stringify( selectedVariation, null, 2 ) }
						</pre>
					</div>
				) }
			</div>
		);
	},
	args: {
		label: __( 'Choose variation' ),
		instructions: __( 'Select a variation to start with:' ),
		icon: 'layout',
		allowSkip: true,
	},
};
