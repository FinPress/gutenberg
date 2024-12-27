/**
 * Internal dependencies
 */
import SpacingSizesControl from '../';

const meta = {
	title: 'BlockEditor/SpacingSizesControl',
	component: SpacingSizesControl,
};

export default meta;

export const Default = {
	render: ( args ) => {
		return <SpacingSizesControl { ...args } />;
	},
};
