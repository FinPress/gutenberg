/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import __experimentalBlockVariationTransforms from '../index';

export default {
	title: 'BlockEditor/BlockVariationTransforms',
	component: __experimentalBlockVariationTransforms,
	parameters: {
		docs: {
			description: {
				component: __(
					'The BlockVariationTransforms component allows users to transform a selected block into one of its variations that have the `transform` option set in the `scope` property.'
				),
			},
		},
	},
	argTypes: {
		blockClientId: {
			control: 'text',
			description: __(
				'The client ID of the block to which the variations apply.'
			),
		},
	},
};

const Template = ( args ) => {
	const { blockClientId } = args;
	const { updateBlockAttributes } = useDispatch( blockEditorStore );
	const { selectedBlockClientId } = useSelect( ( select ) => {
		const { getSelectedBlockClientId } = select( blockEditorStore );
		return {
			selectedBlockClientId: getSelectedBlockClientId(),
		};
	}, [] );

	const clientId = blockClientId || selectedBlockClientId;

	return (
		<__experimentalBlockVariationTransforms
			{ ...args }
			blockClientId={ clientId }
			updateBlockAttributes={ updateBlockAttributes }
		/>
	);
};

export const Default = Template.bind( {} );
Default.args = {
	blockClientId: '',
};
