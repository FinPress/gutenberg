/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalToolsPanelItem as ToolsPanelItem,
	FormTokenField,
} from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';

const getNameById = ( records, id ) => {
	return records.find( ( record ) => record.id === id )?.name;
};

const getIdByName = ( records, name ) => {
	return records.find( ( record ) => record.name === name )?.id;
};

const IncludeExclude = ( { termQuery, setQuery } ) => {
	const { taxonomy, order, orderBy, hideEmpty, perPage } = termQuery;
	const queryArgs = {
		order,
		orderby: orderBy,
		hide_empty: hideEmpty,
		per_page: perPage,
	};

	const { records, isResolving } = useEntityRecords(
		'taxonomy',
		taxonomy,
		queryArgs
	);

	const suggestions = records?.map( ( record ) => record.name );

	return (
		<ToolsPanelItem
			hasValue={ () =>
				termQuery.include.length > 0 || termQuery.exclude.length > 0
			}
			label={ __( 'Filters' ) }
			onDeselect={ () => setQuery( { include: [], exclude: [] } ) }
			isShownByDefault
		>
			<FormTokenField
				__nextHasNoMarginBottom
				__next40pxDefaultSize
				disabled={ isResolving }
				label={ __( 'Include' ) }
				suggestions={ suggestions }
				value={ termQuery.include.map( ( id ) =>
					getNameById( records, id )
				) }
				onChange={ ( newValue ) =>
					setQuery( {
						include: newValue.map( ( name ) =>
							getIdByName( records, name )
						),
					} )
				}
				__experimentalShowHowTo={ false }
			/>
			<FormTokenField
				__nextHasNoMarginBottom
				__next40pxDefaultSize
				disabled={ isResolving }
				label={ __( 'Exclude' ) }
				suggestions={ suggestions }
				value={ termQuery.exclude.map( ( id ) =>
					getNameById( records, id )
				) }
				onChange={ ( newValue ) =>
					setQuery( {
						exclude: newValue.map( ( name ) =>
							getIdByName( records, name )
						),
					} )
				}
				__experimentalShowHowTo={ false }
			/>
		</ToolsPanelItem>
	);
};

export default IncludeExclude;
