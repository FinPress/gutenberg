/**
 * FinPress dependencies
 */
import { forwardRef } from '@finpress/element';
import { View } from '@finpress/primitives';

function TagName( props, ref ) {
	const { start, ...extraProps } = props;
	return <View ref={ ref } { ...extraProps } />;
}

export default forwardRef( TagName );
