/**
 * Stores the type of a rich text format, such as core/bold.
 */
export type RichTextFormat = {
	type:
		| 'core/bold'
		| 'core/italic'
		| 'core/link '
		| 'core/strikethrough'
		| 'core/image'
		| string;
	title?: string;
	attributes?: Record< string, any >;
	unregisteredAttributes?: Record< string, any >;
	tagName?: string; // TODO: Is this correct, possibly should be required?
	innerHTML?: string; // TODO: Is this correct
	object?: boolean; // TODO: Is this correct
};

/**
 * A list of rich text format types.
 */
export type RichTextFormatList = Array< RichTextFormat >;

/**
 * An object which represents a formatted string. The text property contains the
 * text to be formatted, and the formats property contains an array which indicates
 * the formats that are applied to each character in the text. See the main
 * `@wordpress/rich-text` documentation for more detail.
 */
export type RichTextValue = {
	text: string;
	formats: Array< RichTextFormatList | undefined >;
	replacements: Array< RichTextFormat | undefined >;
	// TODO: Should these really be optional?
	start?: number;
	end?: number;
	activeFormats?: Array< RichTextFormat >;
	// TODO: Is this correct?
	object?: boolean; // Whether the format is an object.
};

/**
 * Represents a format in WordPress.
 */
export type WPFormat = {
	tagName: string; // The HTML tag this format will wrap the selection with.
	title: string; // Name of the format.
	edit: ( () => JSX.Element ) | ( () => void ); // Should return a component for the user to interact with the new registered format.

	name?: string; // A string identifying the format. Must be unique across all registered formats.
	interactive?: boolean; // Whether format makes content interactive or not.
	className?: string | null; // A class to match the format.
	keywords?: string[]; // Keywords to match the format. // TODO: Is this correct?
	contentEditable?: boolean; // Whether the format is editable.

	// Experimental
	__experimentalCreatePrepareEditableTree?: () => void; // A function that prepares the editable tree for the format.
	__experimentalCreateOnChangeEditableValue?: () => void; // A function that is called when the editable value changes.

	// TODO: Is these correct?
	attributes?: Record< string, string >; // Attributes to match the format.
	object?: boolean; // Whether the format is an object.
};
