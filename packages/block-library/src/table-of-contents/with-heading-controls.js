/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import HeadingTOCControls from './heading-controls';

/**
 * Higher-order component that adds TOC controls to heading blocks.
 */
const withHeadingTOCControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { name } = props;

		// Only add controls to heading blocks
		if ( name !== 'core/heading' ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				<HeadingTOCControls
					content={ props.attributes.content?.replace(
						/<[^>]*>?/g,
						''
					) }
				/>
			</>
		);
	};
}, 'withHeadingTOCControls' );

export default withHeadingTOCControls;
