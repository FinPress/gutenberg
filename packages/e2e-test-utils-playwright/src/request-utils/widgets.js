/**
 * Delete all the widgets in the widgets screen.
 *
 * @this {import('./index').RequestUtils}
 * @param {Partial<import('./rest').RestOptions>} [restOptions] Optional REST options to override default settings.
 */
export async function deleteAllWidgets( restOptions ) {
	const [ widgets, sidebars ] = await Promise.all( [
		this.rest( { ...restOptions, path: '/wp/v2/widgets' } ),
		this.rest( { ...restOptions, path: '/wp/v2/sidebars' } ),
	] );

	await this.batchRest(
		widgets.map( ( widget ) => ( {
			method: 'DELETE',
			path: `/wp/v2/widgets/${ widget.id }?force=true`,
		} ) ),
		restOptions
	);

	// The endpoint doesn't support batch requests yet.
	await Promise.all(
		sidebars.map( ( sidebar ) =>
			this.rest( {
				...restOptions,
				method: 'POST',
				path: `/wp/v2/sidebars/${ sidebar.id }`,
				data: { id: sidebar.id, widgets: [] },
			} )
		)
	);
}

/**
 * Add a widget block to the widget area.
 *
 * @this {import('./index').RequestUtils}
 * @param {string}                                serializedBlock The serialized content of the inserted block HTML.
 * @param {string}                                widgetAreaId    The ID of the widget area.
 * @param {Partial<import('./rest').RestOptions>} [restOptions]   Optional REST options to override default settings.
 */
export async function addWidgetBlock(
	serializedBlock,
	widgetAreaId,
	restOptions
) {
	const { id: blockId } = await this.rest( {
		...restOptions,
		method: 'POST',
		path: '/wp/v2/widgets',
		data: {
			id_base: 'block',
			sidebar: widgetAreaId,
			instance: {
				raw: { content: serializedBlock },
			},
		},
	} );

	const { widgets } = await this.rest( {
		...restOptions,
		path: `/wp/v2/sidebars/${ widgetAreaId }`,
	} );

	const updatedWidgets = new Set( widgets );
	// Remove duplicate.
	updatedWidgets.delete( blockId );
	// Add to last block.
	updatedWidgets.add( blockId );

	await this.rest( {
		...restOptions,
		method: 'PUT',
		path: `/wp/v2/sidebars/${ widgetAreaId }`,
		data: {
			widgets: [ ...updatedWidgets ],
		},
	} );
}
