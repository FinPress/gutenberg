/**
 * FinPress dependencies
 */
import { forwardRef } from '@finpress/element';

function TagName( props, ref ) {
	const { ordered, ...extraProps } = props;
	const Tag = ordered ? 'ol' : 'ul';

	return <Tag ref={ ref } { ...extraProps } />;
}

export default forwardRef( TagName );
