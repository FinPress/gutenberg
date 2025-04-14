/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	Button,
	Icon,
	__experimentalHStack as HStack,
} from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';

/**
 * Renders a button to display a setting name and its value in an accessible way.
 * The label prop should be used to provide a meaningful accessible name of the button.
 * The displayedValue visually shows the value within the button and avoids to
 * alter the accessible name. Instead, its content is exposed to assistive technology
 * in the accessible description of the button.
 *
 * @param {Object}   props                  Component props.
 * @param {string}   [props.className]      Additional classes to apply to the button.
 * @param {Function} [props.onClick]        The callback function to be executed when the user clicks the button.
 * @param {string}   [props.label]          Visible label and accessible name of the button.
 * @param {string}   [props.displayedValue] Visible value of the setting and accessible description of the button.
 * @param {string}   [props.icon]           Optional icon to be shown before the value.
 * @param {booleab}  [props.isExpanded]     Used for the aria-expanded ARIA state of the button.
 * @return {React.ReactNode} The rendered PostPanelRowButton component.
 */
export default function PostPanelRowButton( {
	className,
	onClick,
	label,
	displayedValue,
	icon,
	isExpanded,
	...props
} ) {
	const descriptionId = useInstanceId(
		PostPanelRowButton,
		'editor-post-panel__row-button-description'
	);

	return (
		<>
			<Button
				className={ clsx( 'editor-post-panel__row-button', className ) }
				variant="tertiary"
				size="compact"
				aria-expanded={ isExpanded }
				onClick={ onClick }
				aria-describedby={ descriptionId }
				{ ...props }
			>
				<HStack as="span">
					<span className="editor-post-panel__row-button-label">
						{ label }
					</span>
					<span
						className={ clsx(
							'editor-post-panel__row-button-value',
							{ 'has-icon': !! icon }
						) }
						aria-hidden="true"
					>
						{ icon && <Icon icon={ icon } /> }
						{ displayedValue }
					</span>
				</HStack>
			</Button>
			<div hidden id={ descriptionId }>
				{ displayedValue }
			</div>
		</>
	);
}
