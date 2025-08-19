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
import DataViews from '../dataviews/index';
import DataForm from '../dataform/index';
import {
	actions,
	data,
	fields,
	type SpaceObject,
} from '../dataviews/stories/fixtures';
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
			options: [ 'default', 'regular', 'panel' ],
		},
		labelPosition: {
			control: { type: 'select' },
			description: 'Chooses the label position of the layout.',
			options: [ 'default', 'top', 'side', 'none' ],
		},
	},
} as const;
export default meta;

const defaultLayouts = {
	table: {},
	grid: {},
	list: {},
};

interface FieldTypeStoryProps {
	fields: Field< SpaceObject >[];
	titleField?: string;
	descriptionField?: string;
	mediaField?: string;
}

const FieldTypeStory = ( {
	fields: storyFields,
	titleField,
	descriptionField,
	mediaField,
}: FieldTypeStoryProps ) => {
	const form: Form = useMemo(
		() => storyFields.map( ( field ) => field.id ),
		[ storyFields ]
	);

	const [ view, setView ] = useState< View >( {
		type: 'table' as const,
		search: '',
		page: 1,
		perPage: 10,
		layout: {},
		filters: [],
		titleField,
		descriptionField,
		mediaField,
		fields: storyFields
			.filter(
				( field ) =>
					! [ titleField, descriptionField, mediaField ].includes(
						field.id
					)
			)
			.map( ( field ) => field.id ),
	} );

	const [ selectedIds, setSelectedIds ] = useState< number[] >( [] );
	const [ modifiedData, setModifiedData ] = useState< SpaceObject[] >( data );

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
					actions={ actions }
					defaultLayouts={ defaultLayouts }
					selection={ selectedIds.map( ( id ) => id.toString() ) }
					onChangeSelection={ ( newSelection ) =>
						setSelectedIds(
							newSelection.map( ( id ) => parseInt( id, 10 ) )
						)
					}
					// eslint-disable-next-line no-alert
					onClickItem={ ( item ) => alert( 'clicked ' + item.title ) }
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

export const All = () => {
	return (
		<FieldTypeStory
			fields={ fields }
			titleField="title"
			descriptionField="description"
			mediaField="image"
		/>
	);
};

export const Text = () => {
	const textFields = useMemo(
		() => fields.filter( ( field ) => field.type === 'text' ),
		[]
	);

	return <FieldTypeStory fields={ textFields } />;
};

export const Integer = () => {
	const integerFields = useMemo(
		() => fields.filter( ( field ) => field.type === 'integer' ),
		[]
	);

	return <FieldTypeStory fields={ integerFields } />;
};

export const Boolean = () => {
	const booleanFields = useMemo(
		() => fields.filter( ( field ) => field.type === 'boolean' ),
		[]
	);

	return <FieldTypeStory fields={ booleanFields } />;
};

export const DateTime = () => {
	const dateTimeFields = useMemo(
		() => fields.filter( ( field ) => field.type === 'datetime' ),
		[]
	);

	return <FieldTypeStory fields={ dateTimeFields } />;
};

export const Date = () => {
	const dateFields = useMemo(
		() => fields.filter( ( field ) => field.type === 'date' ),
		[]
	);

	return <FieldTypeStory fields={ dateFields } />;
};

export const Email = () => {
	const emailFields = useMemo(
		() => fields.filter( ( field ) => field.type === 'email' ),
		[]
	);

	return <FieldTypeStory fields={ emailFields } />;
};

export const Media = () => {
	const mediaFields = useMemo(
		() => fields.filter( ( field ) => field.type === 'media' ),
		[]
	);

	return <FieldTypeStory fields={ mediaFields } />;
};

export const Array = () => {
	const arrayTextFields = useMemo(
		() => fields.filter( ( field ) => field.type === 'array' ),
		[]
	);

	return <FieldTypeStory fields={ arrayTextFields } />;
};

export const NoType = () => {
	const noTypeFields = useMemo(
		() => fields.filter( ( field ) => field.type === undefined ),
		[]
	);

	return <FieldTypeStory fields={ noTypeFields } />;
};
