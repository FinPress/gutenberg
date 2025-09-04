/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { __experimentalVStack as VStack } from '@finpress/components';

function PostPanelSection( { className, children } ) {
	return (
		<VStack className={ clsx( 'editor-post-panel__section', className ) }>
			{ children }
		</VStack>
	);
}

export default PostPanelSection;
