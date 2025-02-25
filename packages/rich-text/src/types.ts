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
	formats: Array< RichTextFormatList >;
	replacements: Array< RichTextFormat >;
	start?: number;
	end?: number;
	// TODO: Should these really be optional?
	activeFormats?: Array< RichTextFormat >;
};

/**
 * Represents a format in WordPress.
 */
export type WPFormat = {
	name: string; // A string identifying the format. Must be unique across all registered formats.
	tagName: string; // The HTML tag this format will wrap the selection with.
	interactive: boolean; // Whether format makes content interactive or not.
	className?: string | null; // A class to match the format.
	title: string; // Name of the format.
	edit: () => JSX.Element; // Should return a component for the user to interact with the new registered format.
	keywords?: string[]; // Keywords to match the format. // TODO: Is this correct?
};
