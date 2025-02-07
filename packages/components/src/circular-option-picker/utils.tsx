/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Computes the common props for the CircularOptionPicker.
 */
export function useComputeCircularOptionPickerCommonProps(
	asButtons?: boolean,
	loop?: boolean,
	ariaLabel?: string,
	ariaLabelledby?: string
) {
	const metaProps = asButtons
		? { asButtons: true }
		: { asButtons: false, loop };

	const labelProps = {
		'aria-labelledby': ariaLabelledby,
		'aria-label': ariaLabelledby
			? undefined
			: ariaLabel || __( 'Custom color picker' ),
	};

	return { metaProps, labelProps };
}
