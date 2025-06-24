/**
 * Possible ways of counting text.
 */
export type WPWordCountStrategy =
	| 'words'
	| 'characters_excluding_spaces'
	| 'characters_including_spaces';

/**
 * L10n settings for word counting.
 */
export interface WPWordCountL10n {
	/**
	 * The type of count to perform.
	 */
	type?: WPWordCountStrategy;

	/**
	 * Array of shortcode names to be removed during counting.
	 */
	shortcodes?: string[];
}

/**
 * Base settings fields that can be configured by users.
 */
export interface WPWordCountUserSettings {
	/**
	 * Regular expressions for various text processing operations.
	 */
	HTMLRegExp?: RegExp;
	HTMLcommentRegExp?: RegExp;
	spaceRegExp?: RegExp;
	HTMLEntityRegExp?: RegExp;
	connectorRegExp?: RegExp;
	removeRegExp?: RegExp;
	astralRegExp?: RegExp;
	wordsRegExp?: RegExp;
	characters_excluding_spacesRegExp?: RegExp;
	characters_including_spacesRegExp?: RegExp;

	/**
	 * Localization settings.
	 */
	l10n?: WPWordCountL10n;
}

/**
 * Complete settings object with all required properties.
 * This includes both static defaults and dynamic runtime properties.
 */
export interface WPWordCountSettings {
	/**
	 * The type of count being performed (set at runtime).
	 */
	type: WPWordCountStrategy;

	/**
	 * Regular expression that matches HTML tags.
	 */
	HTMLRegExp: RegExp;

	/**
	 * Regular expression that matches HTML comments.
	 */
	HTMLcommentRegExp: RegExp;

	/**
	 * Regular expression that matches spaces in HTML.
	 */
	spaceRegExp: RegExp;

	/**
	 * Regular expression that matches HTML entities.
	 */
	HTMLEntityRegExp: RegExp;

	/**
	 * Regular expression that matches word connectors, like em-dash.
	 */
	connectorRegExp: RegExp;

	/**
	 * Regular expression that matches various characters to be removed when counting.
	 */
	removeRegExp: RegExp;

	/**
	 * Regular expression that matches astral UTF-16 code points.
	 */
	astralRegExp: RegExp;

	/**
	 * Regular expression that matches words.
	 */
	wordsRegExp: RegExp;

	/**
	 * Regular expression that matches characters excluding spaces.
	 */
	characters_excluding_spacesRegExp: RegExp;

	/**
	 * Regular expression that matches characters including spaces.
	 */
	characters_including_spacesRegExp: RegExp;

	/**
	 * Localization settings.
	 */
	l10n: WPWordCountL10n;

	/**
	 * Array of shortcode names (set at runtime from l10n.shortcodes).
	 */
	shortcodes: string[];

	/**
	 * Regular expression for matching shortcodes (generated at runtime).
	 */
	shortcodesRegExp?: RegExp;
}

/**
 * Default settings object type (without runtime-added properties).
 */
export interface WPWordCountDefaultSettings {
	HTMLRegExp: RegExp;
	HTMLcommentRegExp: RegExp;
	spaceRegExp: RegExp;
	HTMLEntityRegExp: RegExp;
	connectorRegExp: RegExp;
	removeRegExp: RegExp;
	astralRegExp: RegExp;
	wordsRegExp: RegExp;
	characters_excluding_spacesRegExp: RegExp;
	characters_including_spacesRegExp: RegExp;
	l10n: WPWordCountL10n;
}
