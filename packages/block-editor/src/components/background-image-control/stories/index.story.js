/**
 * Internal dependencies
 */
import BackgroundImagePanel from '../';

/**
 * The `BackgroundImagePanel` component renders a panel that allows the user to set a background image for the block.
 */
const meta = {
	title: 'BlockEditor/BackgroundImagePanel',
	component: BackgroundImagePanel,
};
export default meta;

export const Default = ( args ) => {
	return <BackgroundImagePanel { ...args } />;
};
