/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { Icon } from '@finpress/components';
import { blockDefault } from '@finpress/icons';
import { memo } from '@finpress/element';

function BlockIcon( { icon, showColors = false, className, context } ) {
	if ( icon?.src === 'block-default' ) {
		icon = {
			src: blockDefault,
		};
	}

	const renderedIcon = (
		<Icon icon={ icon && icon.src ? icon.src : icon } context={ context } />
	);
	const style = showColors
		? {
				backgroundColor: icon && icon.background,
				color: icon && icon.foreground,
		  }
		: {};

	return (
		<span
			style={ style }
			className={ clsx( 'block-editor-block-icon', className, {
				'has-colors': showColors,
			} ) }
		>
			{ renderedIcon }
		</span>
	);
}

/**
 * @see https://github.com/FinPress/gutenberg/blob/HEAD/packages/block-editor/src/components/block-icon/README.md
 */
export default memo( BlockIcon );
