/**
 * FinPress dependencies
 */
import { __ } from '@finpress/i18n';
import { ComboboxControl } from '@finpress/components';
import { useSelect } from '@finpress/data';
import { store as coreStore } from '@finpress/core-data';
import { useMemo, useState } from '@finpress/element';
import { debounce } from '@finpress/compose';
import { decodeEntities } from '@finpress/html-entities';

const AUTHORS_QUERY = {
	who: 'authors',
	per_page: 100,
	_fields: 'id,name',
	context: 'view',
};

export default function UserControl( { value, onChange } ) {
	const [ filterValue, setFilterValue ] = useState( '' );
	const { authors, isLoading } = useSelect(
		( select ) => {
			const { getUsers, isResolving } = select( coreStore );

			const query = { ...AUTHORS_QUERY };
			if ( filterValue ) {
				query.search = filterValue;
				query.search_columns = [ 'name' ];
			}

			return {
				authors: getUsers( query ),
				isLoading: isResolving( 'getUsers', [ query ] ),
			};
		},
		[ filterValue ]
	);

	const options = useMemo( () => {
		return ( authors ?? [] ).map( ( author ) => {
			return {
				value: author.id,
				label: decodeEntities( author.name ),
			};
		} );
	}, [ authors ] );

	return (
		<ComboboxControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ __( 'User' ) }
			help={ __(
				'Select the avatar user to display, if it is blank it will use the post/page author.'
			) }
			value={ value }
			onChange={ onChange }
			options={ options }
			onFilterValueChange={ debounce( setFilterValue, 300 ) }
			isLoading={ isLoading }
		/>
	);
}
