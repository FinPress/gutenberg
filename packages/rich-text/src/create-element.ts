/**
 * Parse the given HTML into a body element.
 *
 * Note: The current implementation will return a shared reference, reset on
 * each call to `createElement`. Therefore, you should not hold a reference to
 * the value to operate upon asynchronously, as it may have unexpected results.
 *
 * @param options                                   Options object.
 * @param options.implementation                    The HTML implementation to use.
 * @param options.implementation.createHTMLDocument
 * @param html                                      The HTML to parse.
 *
 * @return Body element with parsed HTML.
 */
export function createElement(
	{
		implementation,
	}: {
		implementation: { createHTMLDocument: ( title: string ) => Document };
	},
	html: string
): HTMLElement {
	// Because `createHTMLDocument` is an expensive operation, and with this
	// function being internal to `rich-text` (full control in avoiding a risk
	// of asynchronous operations on the shared reference), a single document
	// is reused and reset for each call to the function.
	if ( ! ( createElement as any ).body ) {
		( createElement as any ).body =
			implementation.createHTMLDocument( '' ).body;
	}

	( createElement as any ).body.innerHTML = html;

	return ( createElement as any ).body;
}
