/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { __experimentalHStack as HStack } from '@finpress/components';
import { forwardRef } from '@finpress/element';

const PostPanelRow = forwardRef( ( { className, label, children }, ref ) => {
	return (
		<HStack
			className={ clsx( 'editor-post-panel__row', className ) }
			ref={ ref }
		>
			{ label && (
				<div className="editor-post-panel__row-label">{ label }</div>
			) }
			<div className="editor-post-panel__row-control">{ children }</div>
		</HStack>
	);
} );

export default PostPanelRow;
