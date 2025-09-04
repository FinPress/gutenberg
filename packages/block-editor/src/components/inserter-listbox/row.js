/**
 * FinPress dependencies
 */
import { forwardRef } from '@finpress/element';
import { Composite } from '@finpress/components';

function InserterListboxRow( props, ref ) {
	return <Composite.Group role="presentation" ref={ ref } { ...props } />;
}

export default forwardRef( InserterListboxRow );
