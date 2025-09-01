/**
 * WordPress dependencies
 */
import { useState, useMemo } from '@wordpress/element';
import {
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import DataViews from '../../components/dataviews/index';
import DataForm from '../../components/dataform/index';
import { filterSortAndPaginate } from '../../filter-and-sort-data-view';
import type { View, Form, Field } from '../../types';

const meta = {
	title: 'DataViews/FieldTypes',
	component: DataForm,
	argTypes: {
		type: {
			control: { type: 'select' },
			description:
				'Chooses the default layout of each field. "regular" is the default layout.',
			options: [ 'regular', 'panel' ],
		},
	},
	args: {
		type: 'regular',
	},
};
export default meta;

type DataType = {
	id: number;
	text: string;
	integer: number;
	boolean: boolean;
	datetime: string;
	date: string;
	email: string;
	media: string;
	array: string[];
	notype: string;
};

const data: DataType[] = [
	{
		id: 1,
		text: 'Text',
		integer: 1,
		boolean: true,
		datetime: '2021-01-01T14:30:00Z',
		date: '2021-01-01',
		email: 'hi@example.com',
		media: 'https://live.staticflickr.com/7398/9458193857_e1256123e3_z.jpg',
		array: [ 'item1', 'item2', 'item3' ],
		notype: 'No type',
	},
];

const fields: Field< DataType >[] = [
	{
		id: 'text',
		type: 'text',
		label: 'Text',
		description: 'Help for text.',
	},
	{
		id: 'integer',
		type: 'integer',
		label: 'Integer',
		description: 'Help for integer.',
	},
	{
		id: 'boolean',
		type: 'boolean',
		label: 'Boolean',
		description: 'Help for boolean.',
	},
	{
		id: 'datetime',
		type: 'datetime',
		label: 'Datetime',
		description: 'Help for datetime.',
	},
	{
		id: 'date',
		type: 'date',
		label: 'Date',
		description: 'Help for date.',
	},
	{
		id: 'email',
		type: 'email',
		label: 'Email',
		description: 'Help for email.',
	},
	{
		id: 'media',
		type: 'media',
		label: 'Media',
		description: 'Help for media.',
	},
	{
		id: 'array',
		type: 'array',
		label: 'Array',
		description: 'Help for array.',
	},
	{
		id: 'notype',
		label: 'Without type',
		description: 'Help for notype.',
	},
];

interface FieldTypeStoryProps {
	fields: Field< DataType >[];
	type: 'regular' | 'panel';
}

const FieldTypeStory = ( {
	fields: storyFields,
	type,
}: FieldTypeStoryProps ) => {
	const form = useMemo(
		() => ( {
			layout: { type },
			fields: storyFields.map( ( field ) => field.id ),
		} ),
		[ type, storyFields ]
	) as Form;

	const [ view, setView ] = useState< View >( {
		type: 'table' as const,
		search: '',
		page: 1,
		perPage: 10,
		layout: {},
		filters: [],
		fields: storyFields.map( ( field ) => field.id ),
	} );

	const [ selectedIds, setSelectedIds ] = useState< number[] >( [] );
	const [ modifiedData, setModifiedData ] = useState< DataType[] >( data );

	const { data: shownData, paginationInfo } = useMemo( () => {
		return filterSortAndPaginate( modifiedData, view, storyFields );
	}, [ modifiedData, view, storyFields ] );

	const selectedItem =
		( selectedIds.length === 1 &&
			shownData.find( ( item ) => item.id === selectedIds[ 0 ] ) ) ||
		null;

	return (
		<HStack alignment="stretch">
			<div style={ { flex: 2 } }>
				<DataViews
					getItemId={ ( item ) => item.id.toString() }
					data={ shownData }
					paginationInfo={ paginationInfo }
					view={ view }
					fields={ storyFields }
					onChangeView={ setView }
					actions={ [
						{
							id: 'edit',
							label: 'Edit',
							callback: () => {},
							disabled: true,
							supportsBulk: true,
						},
					] }
					defaultLayouts={ {
						table: {},
					} }
					selection={ selectedIds.map( ( id ) => id.toString() ) }
					onChangeSelection={ ( newSelection ) =>
						setSelectedIds(
							newSelection.map( ( id ) => parseInt( id, 10 ) )
						)
					}
				/>
			</div>
			{ selectedItem ? (
				<VStack alignment="top">
					<DataForm
						data={ selectedItem }
						form={ form }
						fields={ storyFields }
						onChange={ ( updatedValues ) => {
							const updatedItem = {
								...selectedItem,
								...updatedValues,
							};

							setModifiedData(
								modifiedData.map( ( item ) =>
									item.id === selectedItem.id
										? updatedItem
										: item
								)
							);
						} }
					/>
				</VStack>
			) : (
				<VStack alignment="center">
					<span
						style={ {
							color: '#888',
						} }
					>
						Please, select a single item.
					</span>
				</VStack>
			) }
		</HStack>
	);
};

export const All = ( { type }: { type: 'regular' | 'panel' } ) => {
	return <FieldTypeStory fields={ fields } type={ type } />;
};

export const Text = ( { type }: { type: 'regular' | 'panel' } ) => {
	const textFields = useMemo(
		() => fields.filter( ( field ) => field.type === 'text' ),
		[]
	);

	return <FieldTypeStory fields={ textFields } type={ type } />;
};

export const Integer = ( { type }: { type: 'regular' | 'panel' } ) => {
	const integerFields = useMemo(
		() => fields.filter( ( field ) => field.type === 'integer' ),
		[]
	);

	return <FieldTypeStory fields={ integerFields } type={ type } />;
};

export const Boolean = ( { type }: { type: 'regular' | 'panel' } ) => {
	const booleanFields = useMemo(
		() => fields.filter( ( field ) => field.type === 'boolean' ),
		[]
	);

	return <FieldTypeStory fields={ booleanFields } type={ type } />;
};

export const DateTime = ( { type }: { type: 'regular' | 'panel' } ) => {
	const dateTimeFields = useMemo(
		() => fields.filter( ( field ) => field.type === 'datetime' ),
		[]
	);

	return <FieldTypeStory fields={ dateTimeFields } type={ type } />;
};

export const Date = ( { type }: { type: 'regular' | 'panel' } ) => {
	const dateFields = useMemo(
		() => fields.filter( ( field ) => field.type === 'date' ),
		[]
	);

	return <FieldTypeStory fields={ dateFields } type={ type } />;
};

export const Email = ( { type }: { type: 'regular' | 'panel' } ) => {
	const emailFields = useMemo(
		() => fields.filter( ( field ) => field.type === 'email' ),
		[]
	);

	return <FieldTypeStory fields={ emailFields } type={ type } />;
};

export const Media = ( { type }: { type: 'regular' | 'panel' } ) => {
	const mediaFields = useMemo(
		() => fields.filter( ( field ) => field.type === 'media' ),
		[]
	);

	return <FieldTypeStory fields={ mediaFields } type={ type } />;
};

export const Array = ( { type }: { type: 'regular' | 'panel' } ) => {
	const arrayTextFields = useMemo(
		() => fields.filter( ( field ) => field.type === 'array' ),
		[]
	);

	return <FieldTypeStory fields={ arrayTextFields } type={ type } />;
};

export const NoType = ( { type }: { type: 'regular' | 'panel' } ) => {
	const noTypeFields = useMemo(
		() => fields.filter( ( field ) => field.type === undefined ),
		[]
	);

	return <FieldTypeStory fields={ noTypeFields } type={ type } />;
};
