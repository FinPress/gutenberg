/**
 * Internal dependencies
 */
import MissingEdit from './missing';

const ClassicEdit = ( props ) => (
	<MissingEdit
		{ ...props }
		attributes={ { ...props.attributes, originalName: props.name } }
	/>
);

export default ClassicEdit;
