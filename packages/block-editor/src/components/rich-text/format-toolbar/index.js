/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToolbarItem, DropdownMenu, Slot } from '@wordpress/components';
import { chevronDown } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { orderBy } from '../../../utils/sorting';
import { useBlockEditingMode } from '../../block-editing-mode';

const POPOVER_PROPS = {
	placement: 'bottom-start',
};

const FormatToolbar = () => {
	const blockEditingMode = useBlockEditingMode();
	const isContentOnlyMode = blockEditingMode === 'contentOnly';

	// In contentOnly mode, only show essential formatting controls
	const primaryFormats = isContentOnlyMode
		? [ 'bold', 'italic', 'link' ]
		: [ 'bold', 'italic', 'link', 'unknown' ];

	return (
		<>
			{ primaryFormats.map( ( format ) => (
				<Slot
					name={ `RichText.ToolbarControls.${ format }` }
					key={ format }
				/>
			) ) }
			{ ! isContentOnlyMode && (
				<Slot name="RichText.ToolbarControls">
					{ ( fills ) => {
						if ( ! fills.length ) {
							return null;
						}

						const allProps = fills.map(
							( [ { props } ] ) => props
						);
						const hasActive = allProps.some(
							( { isActive } ) => isActive
						);

						return (
							<ToolbarItem>
								{ ( toggleProps ) => (
									<DropdownMenu
										icon={ chevronDown }
										/* translators: button label text should, if possible, be under 16 characters. */
										label={ __( 'More' ) }
										toggleProps={ {
											...toggleProps,
											className: clsx(
												toggleProps.className,
												{ 'is-pressed': hasActive }
											),
											description: __(
												'Displays more block tools'
											),
										} }
										controls={ orderBy(
											fills.map(
												( [ { props } ] ) => props
											),
											'title'
										) }
										popoverProps={ POPOVER_PROPS }
									/>
								) }
							</ToolbarItem>
						);
					} }
				</Slot>
			) }
		</>
	);
};

export default FormatToolbar;
