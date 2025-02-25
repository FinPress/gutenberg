/**
 * WordPress dependencies
 */
import { select, dispatch } from '@wordpress/data';
/**
 * Internal dependencies
 */
import { store as richTextStore } from './store';

/**
 * Represents a format in WordPress.
 */
export interface WPFormat {
	name: string; // A string identifying the format. Must be unique across all registered formats.
	tagName: string; // The HTML tag this format will wrap the selection with.
	interactive: boolean; // Whether format makes content interactive or not.
	className?: string | null; // A class to match the format.
	title: string; // Name of the format.
	edit: () => JSX.Element; // Should return a component for the user to interact with the new registered format.
	keywords?: string[]; // Keywords to match the format. // TODO: Is this correct?
}

/**
 * Registers a new format provided a unique name and an object defining its behavior.
 *
 * @param name     - Format name.
 * @param settings - Format settings.
 *
 * @return The format, if it has been successfully registered; otherwise `undefined`.
 */
export function registerFormatType(
	name: string,
	settings: WPFormat
): WPFormat | undefined {
	settings = {
		name, // TODO: Is this hiding a bug?
		...settings,
	};

	if ( typeof settings.name !== 'string' ) {
		window.console.error( 'Format names must be strings.' );
		return;
	}

	if ( ! /^[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*$/.test( settings.name ) ) {
		window.console.error(
			'Format names must contain a namespace prefix, include only lowercase alphanumeric characters or dashes, and start with a letter. Example: my-plugin/my-custom-format'
		);
		return;
	}

	// @ts-expect-error Stores are not typed
	if ( select( richTextStore ).getFormatType( settings.name ) ) {
		window.console.error(
			'Format "' + settings.name + '" is already registered.'
		);
		return;
	}

	if ( typeof settings.tagName !== 'string' || settings.tagName === '' ) {
		window.console.error( 'Format tag names must be a string.' );
		return;
	}

	if (
		( typeof settings.className !== 'string' ||
			settings.className === '' ) &&
		settings.className !== null
	) {
		window.console.error(
			'Format class names must be a string, or null to handle bare elements.'
		);
		return;
	}

	if (
		settings.className !== null &&
		! /^[_a-zA-Z]+[a-zA-Z0-9_-]*$/.test( settings.className )
	) {
		window.console.error(
			'A class name must begin with a letter, followed by any number of hyphens, underscores, letters, or numbers.'
		);
		return;
	}

	if ( settings.className === null ) {
		const formatTypeForBareElement = select(
			// @ts-expect-error Stores are not typed
			richTextStore
		).getFormatTypeForBareElement( settings.tagName );

		if (
			formatTypeForBareElement &&
			formatTypeForBareElement.name !== 'core/unknown'
		) {
			window.console.error(
				`Format "${ formatTypeForBareElement.name }" is already registered to handle bare tag name "${ settings.tagName }".`
			);
			return;
		}
	} else {
		const formatTypeForClassName = select(
			// @ts-expect-error Stores are not typed
			richTextStore
		).getFormatTypeForClassName( settings.className );

		if ( formatTypeForClassName ) {
			window.console.error(
				`Format "${ formatTypeForClassName.name }" is already registered to handle class name "${ settings.className }".`
			);
			return;
		}
	}

	if ( ! ( 'title' in settings ) || settings.title === '' ) {
		window.console.error(
			'The format "' + settings.name + '" must have a title.'
		);
		return;
	}

	if (
		'keywords' in settings &&
		settings.keywords && // TODO: Is this correct?
		settings.keywords.length > 3
	) {
		window.console.error(
			'The format "' +
				settings.name +
				'" can have a maximum of 3 keywords.'
		);
		return;
	}

	if ( typeof settings.title !== 'string' ) {
		window.console.error( 'Format titles must be strings.' );
		return;
	}

	// @ts-expect-error Stores are not typed
	dispatch( richTextStore ).addFormatTypes( settings );

	return settings;
}
