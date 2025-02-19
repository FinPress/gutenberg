/**
 * WordPress dependencies
 */
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

function OrderControl( {
	order,
	orderBy,
	postTypeSupportsPageAttributes,
	onChange,
} ) {
	const orderOptions = [
		{
			label: __( 'Newest to oldest' ),
			value: 'date/desc',
		},
		{
			label: __( 'Oldest to newest' ),
			value: 'date/asc',
		},
		{
			/* translators: label for ordering posts by title in ascending order */
			label: __( 'A → Z' ),
			value: 'title/asc',
		},
		{
			/* translators: label for ordering posts by title in descending order */
			label: __( 'Z → A' ),
			value: 'title/desc',
		},
		// Only include the menu_order option for post types which support page-attributes
		...( postTypeSupportsPageAttributes
			? [
					{
						/* translators: Label for ordering posts by menu_order in ascending order. */
						label: __( 'Ascending Menu Order' ),
						value: 'menu_order/asc',
					},
					{
						/* translators: Label for ordering posts by menu_order in descending order. */
						label: __( 'Descending Menu Order' ),
						value: 'menu_order/desc',
					},
			  ]
			: [] ),
	];

	return (
		<SelectControl
			__nextHasNoMarginBottom
			__next40pxDefaultSize
			label={ __( 'Order by' ) }
			value={ `${ orderBy }/${ order }` }
			options={ orderOptions }
			onChange={ ( value ) => {
				const [ newOrderBy, newOrder ] = value.split( '/' );
				onChange( { order: newOrder, orderBy: newOrderBy } );
			} }
		/>
	);
}

export default OrderControl;
