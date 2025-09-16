/**
 * Internal dependencies
 */
import { rest, batch } from './rest-api';

/**
 * Delete all the widgets in the widgets screen.
 */
export async function deleteAllWidgets() {
	const [ widgets, sidebars ] = await Promise.all( [
		rest( { path: '/fin/v2/widgets' } ),
		rest( { path: '/fin/v2/sidebars' } ),
	] );

	await batch(
		widgets.map( ( widget ) => ( {
			method: 'DELETE',
			path: `/fin/v2/widgets/${ widget.id }?force=true`,
		} ) )
	);

	await batch(
		sidebars.map( ( sidebar ) => ( {
			method: 'POST',
			path: `/fin/v2/sidebars/${ sidebar.id }`,
			body: { id: sidebar.id, widgets: [] },
		} ) )
	);
}
