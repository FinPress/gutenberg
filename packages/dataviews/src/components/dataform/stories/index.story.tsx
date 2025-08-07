/**
 * WordPress dependencies
 */
import { useCallback, useMemo, useState } from '@wordpress/element';
import {
	Button,
	__experimentalVStack as VStack,
	privateApis,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import DataForm from '../index';
import { isItemValid } from '../../../validation';
import type { Field, Form, DataFormControlProps } from '../../../types';
import { unlock } from '../../../lock-unlock';

const { ValidatedTextControl } = unlock( privateApis );

type SamplePost = {
	title: string;
	order: number;
	author: number;
	status: string;
	reviewer: string;
	date: string;
	birthdate: string;
	password?: string;
	filesize?: number;
	dimensions?: string;
};

const meta = {
	title: 'DataViews/DataForm',
	component: DataForm,
	argTypes: {
		type: {
			control: { type: 'select' },
			description:
				'Chooses the default layout of each field. "regular" is the default layout.',
			options: [ 'default', 'regular', 'panel', 'card' ],
		},
		labelPosition: {
			control: { type: 'select' },
			description: 'Chooses the label position of the layout.',
			options: [ 'default', 'top', 'side', 'none' ],
		},
	},
};
export default meta;

const fields = [
	{
		id: 'title',
		label: 'Title',
		type: 'text' as const,
	},
	{
		id: 'order',
		label: 'Order',
		type: 'integer' as const,
	},
	{
		id: 'date',
		label: 'Date',
		type: 'datetime' as const,
	},
	{
		id: 'birthdate',
		label: 'Date as options',
		type: 'datetime' as const,
		elements: [
			{ value: '', label: 'Select a date' },
			{ value: '1970-02-23T12:00:00', label: "Jane's birth date" },
			{ value: '1950-02-23T12:00:00', label: "John's birth date" },
		],
	},
	{
		id: 'author',
		label: 'Author',
		type: 'integer' as const,
		elements: [
			{ value: 1, label: 'Jane' },
			{ value: 2, label: 'John' },
		],
	},
	{
		id: 'reviewer',
		label: 'Reviewer',
		type: 'text' as const,
		Edit: 'radio' as const,
		elements: [
			{ value: 'fulano', label: 'Fulano' },
			{ value: 'mengano', label: 'Mengano' },
			{ value: 'zutano', label: 'Zutano' },
		],
	},
	{
		id: 'status',
		label: 'Status',
		type: 'text' as const,
		Edit: 'toggleGroup' as const,
		elements: [
			{ value: 'draft', label: 'Draft' },
			{ value: 'published', label: 'Published' },
			{ value: 'private', label: 'Private' },
		],
	},
	{
		id: 'email',
		label: 'Email',
		type: 'email' as const,
	},
	{
		id: 'password',
		label: 'Password',
		type: 'text' as const,
		isVisible: ( item: SamplePost ) => {
			return item.status !== 'private';
		},
	},
	{
		id: 'sticky',
		label: 'Sticky',
		type: 'boolean',
	},
	{
		id: 'can_comment',
		label: 'Allow people to leave a comment',
		type: 'boolean' as const,
		Edit: 'checkbox',
	},
	{
		id: 'filesize',
		label: 'File Size',
		type: 'integer' as const,
		readOnly: true,
	},
	{
		id: 'dimensions',
		label: 'Dimensions',
		type: 'text' as const,
		readOnly: true,
	},
] as Field< SamplePost >[];

export const Default = ( {
	type,
	labelPosition,
}: {
	type: 'default' | 'regular' | 'panel' | 'card';
	labelPosition: 'default' | 'top' | 'side' | 'none';
} ) => {
	const [ post, setPost ] = useState( {
		title: 'Hello, World!',
		order: 2,
		author: 1,
		status: 'draft',
		reviewer: 'fulano',
		email: 'hello@wordpress.org',
		date: '2021-01-01T12:00:00',
		birthdate: '1950-02-23T12:00:00',
		sticky: false,
		can_comment: false,
		filesize: 1024,
		dimensions: '1920x1080',
	} );

	const form = useMemo(
		() => ( {
			layout: {
				type,
				labelPosition,
			},
			fields: [
				'title',
				'order',
				'sticky',
				'author',
				'status',
				'reviewer',
				'email',
				'password',
				'date',
				'birthdate',
				'can_comment',
				'filesize',
				'dimensions',
			],
		} ),
		[ type, labelPosition ]
	) as Form;

	return (
		<DataForm< SamplePost >
			data={ post }
			fields={ fields }
			form={ form }
			onChange={ ( edits ) =>
				setPost( ( prev ) => ( {
					...prev,
					...edits,
				} ) )
			}
		/>
	);
};

const CombinedFieldsComponent = ( {
	type,
	labelPosition,
}: {
	type: 'default' | 'regular' | 'panel' | 'card';
	labelPosition: 'default' | 'top' | 'side' | 'none';
} ) => {
	const [ post, setPost ] = useState< SamplePost >( {
		title: 'Hello, World!',
		order: 2,
		author: 1,
		status: 'draft',
		reviewer: 'fulano',
		date: '2021-01-01T12:00:00',
		birthdate: '1950-02-23T12:00:00',
		filesize: 1024,
		dimensions: '1920x1080',
	} );

	const form = useMemo(
		() => ( {
			layout: {
				type,
				labelPosition,
			},
			fields: [
				'title',
				{
					id: 'status',
					label: 'Status & Visibility',
					children: [ 'status', 'password' ],
				},
				'order',
				'author',
				'filesize',
				'dimensions',
			],
		} ),
		[ type, labelPosition ]
	) as Form;

	return (
		<DataForm< SamplePost >
			data={ post }
			fields={ fields }
			form={ form }
			onChange={ ( edits ) =>
				setPost( ( prev ) => ( {
					...prev,
					...edits,
				} ) )
			}
		/>
	);
};

export const CombinedFields = {
	title: 'DataViews/CombinedFields',
	render: CombinedFieldsComponent,
	argTypes: {
		...meta.argTypes,
	},
	args: {
		type: 'panel',
	},
};

function CustomEditControl< Item >( {
	data,
	field,
	onChange,
	hideLabelFromVision,
}: DataFormControlProps< Item > ) {
	const { id, label, placeholder, description } = field;
	const value = field.getValue( { item: data } );

	const onChangeControl = useCallback(
		( newValue: string ) =>
			onChange( {
				[ id ]: newValue,
			} ),
		[ id, onChange ]
	);

	return (
		<ValidatedTextControl
			required={ !! field.isValid?.required }
			label={ label }
			placeholder={ placeholder }
			value={ value ?? '' }
			help={ description }
			onChange={ onChangeControl }
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			hideLabelFromVision={ hideLabelFromVision }
		/>
	);
}

const DataFormValidationComponent = ( { required }: { required: boolean } ) => {
	type ValidatedItem = {
		text: string;
		email: string;
		integer: number;
		boolean: boolean;
		customEdit: string;
		customValidation: string;
	};

	const [ post, setPost ] = useState< ValidatedItem >( {
		text: 'Hello, World!',
		email: 'hi@example.com',
		integer: 2,
		boolean: true,
		customEdit: 'custom control',
		customValidation: 'potato',
	} );

	const _fields: Field< ValidatedItem >[] = [
		{
			id: 'text',
			type: 'text' as const,
			label: 'Text',
			isValid: {
				required,
			},
		},
		{
			id: 'email',
			type: 'email' as const,
			label: 'e-mail',
			isValid: {
				required,
			},
		},
		{
			id: 'integer',
			type: 'integer' as const,
			label: 'Integer',
			isValid: {
				required,
			},
		},
		{
			id: 'boolean',
			type: 'boolean' as const,
			label: 'Boolean',
			isValid: {
				required,
			},
		},
		{
			id: 'customEdit',
			label: 'Custom Control',
			Edit: CustomEditControl,
			isValid: {
				required,
			},
		},
		{
			id: 'customValidation',
			type: 'text',
			label: 'Custom validation',
			isValid: {
				required,
				custom: ( value: ValidatedItem ) => {
					if (
						! [ 'tomato', 'potato' ].includes(
							value.customValidation
						)
					) {
						return 'Value must be one of "tomato", "potato"';
					}

					return null;
				},
			},
		},
	];

	const form = {
		fields: [
			'text',
			'email',
			'integer',
			'boolean',
			'customEdit',
			'customValidation',
		],
	};

	const canSave = isItemValid( post, _fields, form );

	return (
		<form>
			<VStack alignment="left">
				<DataForm< ValidatedItem >
					data={ post }
					fields={ _fields }
					form={ form }
					onChange={ ( edits ) =>
						setPost( ( prev ) => ( {
							...prev,
							...edits,
						} ) )
					}
				/>
				<Button
					__next40pxDefaultSize
					accessibleWhenDisabled
					disabled={ ! canSave }
					variant="primary"
				>
					Submit
				</Button>
			</VStack>
		</form>
	);
};

export const Validation = {
	title: 'DataForm/Validation',
	render: DataFormValidationComponent,
	argTypes: {
		required: {
			control: { type: 'boolean' },
			description: 'Whether or not the fields are required.',
		},
	},
	args: {
		required: true,
	},
};

const DataFormVisibilityComponent = () => {
	type Post = {
		name: string;
		email: string;
		isActive: boolean;
	};
	const [ data, setData ] = useState( {
		name: '',
		email: '',
		isActive: true,
	} );

	const _fields = [
		{ id: 'isActive', label: 'Is module active?', type: 'boolean' },
		{
			id: 'name',
			label: 'Name',
			type: 'text',
			isVisible: ( post ) => post.isActive === true,
		},
		{
			id: 'email',
			label: 'Email',
			type: 'email',
			isVisible: ( post ) => post.isActive === true,
		},
	] satisfies Field< Post >[];
	const form = {
		fields: [ 'isActive', 'name', 'email' ],
	};
	return (
		<DataForm< Post >
			data={ data }
			fields={ _fields }
			form={ form }
			onChange={ ( edits ) =>
				setData( ( prev ) => ( {
					...prev,
					...edits,
				} ) )
			}
		/>
	);
};

export const Visibility = {
	title: 'DataForm/Visibility',
	render: DataFormVisibilityComponent,
};

const CardLayoutComponent = () => {
	// Customer fields definition
	const customerFields = [
		{
			id: 'name',
			label: 'Customer Name',
			type: 'text' as const,
		},
		{
			id: 'customerType',
			label: 'Type',
			type: 'text' as const,
			Edit: 'toggleGroup' as const,
			elements: [
				{ value: 'Customer', label: 'Customer' },
				{ value: 'Business', label: 'Business' },
				{ value: 'VIP', label: 'VIP' },
			],
		},
		{
			id: 'email',
			label: 'Email',
			type: 'email' as const,
		},
		{
			id: 'phone',
			label: 'Phone',
			type: 'text' as const,
		},
		{
			id: 'shippingAddress',
			label: 'Shipping Address',
			type: 'text' as const,
		},
		{
			id: 'billingAddress',
			label: 'Billing Address',
			type: 'text' as const,
		},
		{
			id: 'totalOrders',
			label: 'Total Orders',
			type: 'integer' as const,
			readOnly: true,
		},
		{
			id: 'totalRevenue',
			label: 'Total Revenue',
			type: 'integer' as const,
			readOnly: true,
		},
		{
			id: 'averageOrderValue',
			label: 'Average Order Value',
			type: 'integer' as const,
			readOnly: true,
		},
	];

	const [ customer, setCustomer ] = useState( {
		name: 'Danyka Romaguera',
		customerType: 'Customer',
		email: 'aromaguera@example.org',
		phone: '1-828-352-1250',
		shippingAddress: 'N/A',
		billingAddress: 'Danyka Romaguera, West Myrtiehaven, 80240-4282, BI',
		totalOrders: 1,
		totalRevenue: 720,
		averageOrderValue: 720,
	} );

	const form = useMemo(
		() => ( {
			layout: {
				type: 'card' as const,
				labelPosition: 'top' as const,
				opened: true,
			},
			fields: [
				{
					id: 'customer-container',
					label: 'Customer',
					children: [
						{
							id: 'name-phone',
							layout: { type: 'panel', labelPosition: 'top' },
							children: [
								{
									id: 'name',
									layout: {
										type: 'regular',
										labelPosition: 'top',
									},
								},
								{
									id: 'phone',
									layout: {
										type: 'regular',
										labelPosition: 'top',
									},
								},
							],
							label: 'Customer Information',
						},
						{
							id: 'customerType',
							layout: { type: 'panel', labelPosition: 'top' },
						},
						{
							id: 'shippingAddress',
							layout: { type: 'panel', labelPosition: 'top' },
						},
						{
							id: 'billingAddress',
							layout: { type: 'panel', labelPosition: 'top' },
						},
					],
				},
			],
		} ),
		[]
	);

	return (
		<DataForm
			data={ customer }
			fields={ customerFields }
			form={ form }
			onChange={ ( edits ) =>
				setCustomer( ( prev ) => ( {
					...prev,
					...edits,
				} ) )
			}
		/>
	);
};

export const CustomerProfile = {
	title: 'DataForm/Card Layout',
	render: CardLayoutComponent,
};

const MixedLayoutComponent = () => {
	const [ post, setPost ] = useState< SamplePost >( {
		title: 'Hello, World!',
		order: 2,
		author: 1,
		status: 'draft',
		reviewer: 'fulano',
		date: '2021-01-01T12:00:00',
		birthdate: '1950-02-23T12:00:00',
		filesize: 1024,
		dimensions: '1920x1080',
	} );

	const form = useMemo(
		() => ( {
			layout: {
				type: 'card',
				labelPosition: 'top',
				opened: true,
			} as const,
			fields: [
				'title',
				{
					id: 'status',
					label: 'Status',
					layout: { type: 'panel', labelPosition: 'top' } as const,
				},
			],
		} ),
		[]
	);

	return (
		<DataForm< SamplePost >
			data={ post }
			fields={ fields }
			form={ form }
			onChange={ ( edits ) =>
				setPost( ( prev ) => ( {
					...prev,
					...edits,
				} ) )
			}
		/>
	);
};

export const MixedLayout = {
	title: 'DataForm/Mixed Layout',
	render: MixedLayoutComponent,
};
