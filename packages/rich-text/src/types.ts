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
	attributes?: Record< string, string >;
	unregisteredAttributes?: Record< string, string >;
	tagName?: string; // TODO: Is this correct?
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
	start: number;
	end: number;
	// TODO: Should these really be optional?
	activeFormats?: Array< RichTextFormat >;
};
