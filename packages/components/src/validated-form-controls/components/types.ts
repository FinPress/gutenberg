export type ValidatedControlProps< V > = {
	/**
	 * Whether the control is required.
	 * @default false
	 */
	required?: boolean;
	/**
	 * Label the control as "optional" when _not_ `required`, instead of the inverse.
	 * @default false
	 */
	markWhenOptional?: boolean;
	/**
	 * Optional callback to run when the input should be validated. Use this to set
	 * a `customValidityMessage` as necessary.
	 *
	 * Always prefer using standard HTML attributes like `required` and `min`/`max` over
	 * custom validators when possible, as they are simpler and have localized error messages built in.
	 */
	onValidate?: ( currentValue: V ) => void;
	/**
	 * Show a custom message based on the validation status.
	 *
	 * - When `type` is `invalid`, the message will be applied to the underlying element using the
	 * native [`setCustomValidity()` method](https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/setCustomValidity).
	 * This means the custom message will be prioritized over any existing validity messages
	 * triggered by HTML attribute-based validation.
	 * - When `type` is `validating` or `valid`, the custom validity message of the underlying element
	 * will be cleared, and the optional message will be presented as a status indicator rather than an error.
	 * Any existing validity messages triggered by HTML attribute-based validation will be prioritized.
	 */
	customValidityMessage?: {
		type: 'validating' | 'valid' | 'invalid';
		message?: string;
	};
};
