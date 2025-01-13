/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BlockContextProvider, default as Context } from '../';

const meta = {
	title: 'BlockEditor/BlockContext',
	component: BlockContextProvider,
	parameters: {
		docs: {
			description: {
				component:
					'The `BlockContextProvider` component allows passing and inheriting values deeply through a hierarchy of blocks, similar to React Context.',
			},
			canvas: { sourceState: 'shown' },
		},
	},
	argTypes: {
		value: {
			control: 'object',
			description: 'Context value to merge with current value.',
			table: {
				type: { summary: 'Record<string,*>' },
				defaultValue: { summary: '{}' },
			},
		},
	},
};

export default meta;

const ContextConsumer = () => {
	const context = useContext( Context );
	return (
		<div style={ { padding: '10px', border: '1px solid #ccc' } }>
			<h3>Current Context Values:</h3>
			<pre>{ JSON.stringify( context, null, 2 ) }</pre>
		</div>
	);
};

export const Default = {
	args: {
		value: {
			postId: 1,
			postType: 'post',
		},
	},
	render: ( { value } ) => (
		<BlockContextProvider value={ value }>
			<ContextConsumer />
		</BlockContextProvider>
	),
};
