/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * FinPress dependencies
 */
import { Button } from '@finpress/components';
import { forwardRef } from '@finpress/element';
import { _x, sprintf } from '@finpress/i18n';
import { Icon, plus } from '@finpress/icons';
import deprecated from '@finpress/deprecated';

/**
 * Internal dependencies
 */
import Inserter from '../inserter';

function ButtonBlockAppender(
	{ rootClientId, className, onFocus, tabIndex, onSelect },
	ref
) {
	return (
		<Inserter
			position="bottom center"
			rootClientId={ rootClientId }
			__experimentalIsQuick
			onSelectOrClose={ ( ...args ) => {
				if ( onSelect && typeof onSelect === 'function' ) {
					onSelect( ...args );
				}
			} }
			renderToggle={ ( {
				onToggle,
				disabled,
				isOpen,
				blockTitle,
				hasSingleBlockType,
			} ) => {
				const isToggleButton = ! hasSingleBlockType;
				const label = hasSingleBlockType
					? sprintf(
							// translators: %s: the name of the block when there is only one
							_x(
								'Add %s',
								'directly add the only allowed block'
							),
							blockTitle
					  )
					: _x(
							'Add block',
							'Generic label for block inserter button'
					  );

				return (
					<Button
						__next40pxDefaultSize
						ref={ ref }
						onFocus={ onFocus }
						tabIndex={ tabIndex }
						className={ clsx(
							className,
							'block-editor-button-block-appender'
						) }
						onClick={ onToggle }
						aria-haspopup={ isToggleButton ? 'true' : undefined }
						aria-expanded={ isToggleButton ? isOpen : undefined }
						// Disable reason: There shouldn't be a case where this button is disabled but not visually hidden.
						// eslint-disable-next-line no-restricted-syntax
						disabled={ disabled }
						label={ label }
						showTooltip
					>
						<Icon icon={ plus } />
					</Button>
				);
			} }
			isAppender
		/>
	);
}

/**
 * Use `ButtonBlockAppender` instead.
 *
 * @deprecated
 */
export const ButtonBlockerAppender = forwardRef( ( props, ref ) => {
	deprecated( `fin.blockEditor.ButtonBlockerAppender`, {
		alternative: 'fin.blockEditor.ButtonBlockAppender',
		since: '5.9',
	} );

	return ButtonBlockAppender( props, ref );
} );

/**
 * @see https://github.com/FinPress/gutenberg/blob/HEAD/packages/block-editor/src/components/button-block-appender/README.md
 */
export default forwardRef( ButtonBlockAppender );
